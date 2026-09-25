// ============================================================================
//  Vivid Lite Shaders — shared GLSL libraries (shaders/lib/*.glsl)
//  These files are included by every program with #include "/lib/xxx.glsl"
// ============================================================================

import { AUTHOR, REPO_URL, VERSION } from './version';

/** Standard header injected at the top of every generated GLSL file. */
const H = (file: string) => `// Vivid Lite Shaders v${VERSION} — ${file}
// Author: ${AUTHOR} | ${REPO_URL}`;

export const LIB_UNIFORMS = `${H('lib/uniforms.glsl')}
// All uniforms we may need. Unused ones are optimised away by the driver.
uniform sampler2D gtexture;
uniform sampler2D lightmap;
uniform mat4 gbufferModelView;
uniform mat4 gbufferModelViewInverse;
uniform mat4 gbufferProjection;
uniform mat4 gbufferProjectionInverse;
uniform vec3 sunPosition;
uniform vec3 moonPosition;
uniform vec3 shadowLightPosition;
uniform vec3 upPosition;
uniform vec3 cameraPosition;
uniform vec3 skyColor;
uniform vec3 fogColor;
uniform vec4 entityColor;
uniform float frameTimeCounter;
uniform float rainStrength;
uniform float wetness;
uniform float nightVision;
uniform float blindness;
uniform float darknessFactor;
uniform float viewWidth;
uniform float viewHeight;
uniform float aspectRatio;
uniform float near;
uniform float far;
uniform int isEyeInWater;
uniform int worldTime;
uniform int moonPhase;
uniform int heldBlockLightValue;
uniform int heldBlockLightValue2;
uniform ivec2 eyeBrightnessSmooth;
`;

export const LIB_COMMON = `${H('lib/common.glsl')}
// Tiny helpers (zero-cost macros + a few inline funcs).

#define sat(x) clamp(x, 0.0, 1.0)

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 toLinear(vec3 c) { return pow(max(c, vec3(0.0)), vec3(2.2)); }
vec3 toSRGB(vec3 c)   { return pow(max(c, vec3(0.0)), vec3(1.0 / 2.2)); }

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

// Fast 1-tap blue-noise-ish hash for dithering (single mad vs full hash13).
float hash11(float x) { return fract(x * 0.1031); }

// Safe invert: 0 -> 1 instead of 0 -> inf (avoids INF in tints).
float rcpSafe(float v) { return 1.0 / max(v, 1e-4); }
`;

export const LIB_ATMOSPHERE = `${H('lib/atmosphere.glsl')}
// Time of day, sky gradient, light colors. All LINEAR.
// BSL-like "blue shadows / warm sun" look lives here.

#if BLOCKLIGHT_WARMTH == 0
    #define BLOCKLIGHT_COL vec3(1.00, 0.86, 0.66)
#elif BLOCKLIGHT_WARMTH == 1
    #define BLOCKLIGHT_COL vec3(1.00, 0.58, 0.27)
#else
    #define BLOCKLIGHT_COL vec3(1.00, 0.42, 0.14)
#endif

float getDayFactor(float sunH)    { return smoothstep(-0.05, 0.25, sunH); }
float getSunsetFactor(float sunH) { float s = 1.0 - smoothstep(0.0, 0.32, abs(sunH)); return s * s; }
float getSunVis(float sunH)       { return smoothstep(-0.04, 0.14, sunH); }
float getMoonVis(float sunH)      { return smoothstep(0.02, 0.18, -sunH); }
/** 0 at day, 1 deep in the night — drives every night-only effect. */
float getNightFactor(float sunH)  { return 1.0 - smoothstep(-0.12, 0.06, sunH); }

// Night palette (v1.1.0). NIGHT_TINT: 0 blue (BSL), 1 teal, 2 purple.
#if NIGHT_TINT == 1
    #define NIGHT_LIGHT_COL vec3(0.30, 0.62, 0.72)
    #define NIGHT_AMB_COL   vec3(0.13, 0.30, 0.36)
    #define NIGHT_ZENITH    vec3(0.004, 0.020, 0.032)
    #define NIGHT_HORIZON   vec3(0.014, 0.046, 0.060)
#elif NIGHT_TINT == 2
    #define NIGHT_LIGHT_COL vec3(0.52, 0.40, 0.86)
    #define NIGHT_AMB_COL   vec3(0.22, 0.16, 0.40)
    #define NIGHT_ZENITH    vec3(0.014, 0.007, 0.034)
    #define NIGHT_HORIZON   vec3(0.034, 0.020, 0.062)
#else
    #define NIGHT_LIGHT_COL vec3(0.34, 0.50, 0.95)
    #define NIGHT_AMB_COL   vec3(0.14, 0.24, 0.50)
    #define NIGHT_ZENITH    vec3(0.005, 0.010, 0.030)
    #define NIGHT_HORIZON   vec3(0.018, 0.034, 0.070)
#endif

// Direct light (sun or moon, whichever is up) and ambient sky light.
void getLightColors(float sunH, float rain, vec3 fogLin, out vec3 lightCol, out vec3 ambientCol) {
#if defined NETHER
    lightCol   = vec3(0.0);
    ambientCol = (fogLin * 3.0 + vec3(0.10, 0.05, 0.045)) * AMBIENT_I;
#elif defined END
    lightCol   = vec3(0.60, 0.50, 0.80) * 0.45 * SUNLIGHT_I;
    ambientCol = vec3(0.11, 0.09, 0.17) * AMBIENT_I;
#else
    float dayF    = getDayFactor(sunH);
    float sunsetF = getSunsetFactor(sunH);
    float nightF  = getNightFactor(sunH);

    vec3 sunCol  = mix(vec3(1.00, 0.46, 0.16) * 1.05, vec3(1.00, 0.93, 0.82) * 1.30, smoothstep(0.02, 0.36, sunH)) * getSunVis(sunH);

    // ── moonlight (v1.1.0): brighter, tinted, follows the moon phase ──
    // moonPhase 0 = full moon, 4 = new moon (Minecraft convention)
    float phase   = 1.0 - abs(float(moonPhase) - 4.0) * 0.25;   // 0 (new) .. 1 (full)
    float phaseI  = mix(0.35, 1.0, phase);
    vec3  moonCol = NIGHT_LIGHT_COL * 0.30 * phaseI * MOONLIGHT * getMoonVis(sunH);

    vec3 amb = mix(NIGHT_AMB_COL * 0.42, vec3(0.40, 0.56, 0.92) * 0.42, dayF);
    amb      = mix(amb, vec3(0.62, 0.42, 0.48) * 0.32, sunsetF * 0.6);
    // lift night ambient a touch so caves/interiors read as "night", not "black"
    amb     *= mix(1.0, NIGHT_BRIGHTNESS * (0.65 + 0.35 * phaseI), nightF);

    vec3 light = (sunCol + moonCol) * (1.0 - 0.92 * rain);
    amb = mix(amb, vec3(luma(amb)) * vec3(0.85, 0.90, 1.00), rain * 0.6) * (1.0 - 0.25 * rain);

    lightCol   = light * SUNLIGHT_I;
    ambientCol = amb * AMBIENT_I;
#endif
}

// ── Cheap 2-color sky (v1.1.1) for very far / Potato tier ──
vec3 getSkyCheap(vec3 dir, vec3 fogLin) {
    float t = sat(dir.y);
    return mix(fogLin * 0.85, fogLin * 1.4, t);
}

// Procedural sky. dir and sunDir are normalized WORLD directions.
vec3 getSkyColor(vec3 dir, vec3 sunDir, float rain, vec3 fogLin) {
#if defined NETHER
    vec3 base = fogLin * 2.5 + vec3(0.020, 0.006, 0.005);
    return mix(base * 1.25, base * 0.55, pow(abs(dir.y), 0.5));
#elif defined END
    float t = pow(abs(dir.y), 0.6);
    return mix(vec3(0.080, 0.055, 0.120), vec3(0.018, 0.010, 0.032), t);
#else
    float sunH    = sunDir.y;
    float dayF    = getDayFactor(sunH);
    float sunsetF = getSunsetFactor(sunH) * SUNSET_INTENSITY;
    float upF     = sat(dir.y);
    float t       = pow(upF, 0.55);

    vec2 d2 = dir.xz / (length(dir.xz) + 0.001);
    vec2 s2 = sunDir.xz / (length(sunDir.xz) + 0.001);
    float azim = dot(d2, s2) * 0.5 + 0.5;

    float nightF = getNightFactor(sunH);
    float phase  = 1.0 - abs(float(moonPhase) - 4.0) * 0.25;

    // ── night sky (v1.1.0): deeper, tinted, with a subtle horizon lift ──
    vec3 nightZen = NIGHT_ZENITH  * NIGHT_BRIGHTNESS;
    vec3 nightHor = NIGHT_HORIZON * NIGHT_BRIGHTNESS;

    vec3 zenith  = mix(nightZen, vec3(0.030, 0.150, 0.620), dayF);
    vec3 horizon = mix(nightHor, vec3(0.420, 0.600, 0.900), dayF);

    vec3 setHor = mix(vec3(0.50, 0.24, 0.36), vec3(1.00, 0.42, 0.12), azim * azim);
    zenith  = mix(zenith,  vec3(0.045, 0.070, 0.240), sunsetF * 0.7);
    horizon = mix(horizon, setHor, sunsetF);

    vec3 sky = mix(horizon, zenith, t);

    // sun glow / haze
    float VdotS = max(dot(dir, sunDir), 0.0);
    float glow  = pow(VdotS, 6.0) * 0.30 + pow(VdotS, 40.0) * 0.55;
    glow *= mix(0.35, 1.6, sunsetF) * getSunVis(sunH) * (1.0 - 0.5 * upF);
    sky += mix(vec3(1.0, 0.92, 0.75), vec3(1.0, 0.45, 0.15), sunsetF) * glow;

    // ── moon halo (v1.1.0) ──
    float VdotM = max(dot(dir, -sunDir), 0.0);
    float moonVis = getMoonVis(sunH);
#ifdef MOON_GLOW
    float halo = pow(VdotM, 12.0) * 0.10 + pow(VdotM, 90.0) * 0.55 + pow(VdotM, 3.0) * 0.018;
    sky += NIGHT_LIGHT_COL * halo * moonVis * phase * MOONLIGHT * 0.9;
#else
    sky += NIGHT_LIGHT_COL * pow(VdotM, 30.0) * 0.06 * moonVis;
#endif

    // faint airglow so the night horizon never reads as pure black
    sky += NIGHT_HORIZON * 0.5 * nightF * (1.0 - t) * NIGHT_BRIGHTNESS;

    // below the horizon
    float below = smoothstep(0.0, 0.3, -dir.y);
    sky = mix(sky, horizon * 0.3, below);

    // rain / storm
    vec3 rainHor = mix(vec3(0.010, 0.011, 0.014), vec3(0.32, 0.35, 0.40), dayF);
    vec3 rainZen = mix(vec3(0.006, 0.007, 0.010), vec3(0.16, 0.18, 0.22), dayF);
    sky = mix(sky, mix(rainHor, rainZen, t), rain * 0.9);
    return sky;
#endif
}
`;

export const LIB_WAVING = `${H('lib/waving.glsl')}
// Vertex animation for plants and leaves (very cheap: a few sines per vertex).
vec3 getWave(int id, vec3 worldPos, bool topVertex, float time, float rain) {
    vec3 wave = vec3(0.0);
    float wind = WAVING_STRENGTH * (1.0 + rain * 1.2);
    float t = time * 1.3;
#ifdef WAVING_PLANTS
    if (id == 10001 && topVertex) {
        float w1 = sin(t * 1.10 + worldPos.x * 1.20 + worldPos.z * 0.80);
        float w2 = sin(t * 1.70 + worldPos.x * 0.60 - worldPos.z * 1.40);
        float w3 = sin(t * 1.35 - worldPos.x * 0.45 + worldPos.z * 1.10);
        wave = vec3(w1 * 0.05 + w2 * 0.03, 0.0, w3 * 0.045 + w2 * 0.02) * wind;
    }
#endif
#ifdef WAVING_LEAVES
    if (id == 10002) {
        float l1 = sin(t * 0.90 + worldPos.x * 0.90 + worldPos.y * 0.60);
        float l2 = sin(t * 1.30 + worldPos.z * 0.70 + worldPos.y * 0.40 + 1.7);
        float l3 = sin(t * 1.10 + worldPos.x * 0.50 + worldPos.z * 0.90 + 3.1);
        wave = vec3(l1, l2 * 0.5, l3) * 0.028 * wind;
    }
#endif
    return wave;
}
`;

export const LIB_SHADOWS = `${H('lib/shadows.glsl')}
// Distorted shadow map lookup. Hardware PCF gives a free 2×2 tap.
#if defined SHADOWS && !defined NO_SHADOWS
uniform mat4 shadowModelView;
uniform mat4 shadowProjection;

#ifdef LEGACY_SHADOW
// ── Legacy path (MC 1.8–1.12 / old OptiFine / drivers without shadow samplers) ──
// Plain sampler2D + manual depth comparison. Works everywhere, costs one extra compare.
uniform sampler2D shadowtex1;
#ifdef COLORED_SHADOWS
uniform sampler2D shadowtex0;
uniform sampler2D shadowcolor0;
#endif

vec3 sampleShadow(vec3 p) {
    float opaque = step(p.z, texture2D(shadowtex1, p.xy).x);
#ifdef COLORED_SHADOWS
    float allT = step(p.z, texture2D(shadowtex0, p.xy).x);
    vec3  tint = texture2D(shadowcolor0, p.xy).rgb;
    return mix(tint * opaque, vec3(1.0), allT);
#else
    return vec3(opaque);
#endif
}
#else
// ── Modern path: hardware PCF gives a free 2×2 blur ──
uniform sampler2DShadow shadowtex1;
#ifdef COLORED_SHADOWS
uniform sampler2DShadow shadowtex0;
uniform sampler2D shadowcolor0;
#endif

vec3 sampleShadow(vec3 p) {
    float opaque = shadow2D(shadowtex1, p).x;
#ifdef COLORED_SHADOWS
    float allT = shadow2D(shadowtex0, p).x;
    vec3  tint = texture2D(shadowcolor0, p.xy).rgb;
    return mix(tint * opaque, vec3(1.0), allT);
#else
    return vec3(opaque);
#endif
}
#endif

// Project a player-space position into distorted shadow-map UV + depth.
// MUST mirror the distortion in program/shadow.glsl exactly, otherwise the
// lookup lands on the wrong texel and shadows vanish / smear.
vec3 shadowProject(vec3 feetPos) {
    vec3 sp = (shadowProjection * (shadowModelView * vec4(feetPos, 1.0))).xyz;
    float df = length(sp.xy) * SHADOW_DISTORT + (1.0 - SHADOW_DISTORT);
    sp.xy /= df;
    sp.z  *= 0.2;               // same depth squash as the shadow pass
    return sp * 0.5 + 0.5;      // clip [-1,1] -> texture [0,1]
}

// feetPos: player-space position. offsetDir: normal (solid) or light direction (plants).
vec3 getShadow(vec3 feetPos, vec3 offsetDir, float NdotL) {
    float dist = length(feetPos);
    // Hard cull past SHADOW_CUTOFF — skip the texture lookup entirely
    if (dist >= SHADOW_CUTOFF) return vec3(1.0);
    float fade = sat((dist - shadowDistance * 0.7) / (shadowDistance * 0.3));
    if (fade >= 1.0) return vec3(1.0);

    // v1.1.2 FIX: \`sp\` was read before it was declared (\`length(sp.xy)\`), so every
    // program that included this file failed to compile when SHADOWS was on —
    // this was the "shadows don't load at all" bug. We now project the
    // un-offset position first (1 extra mat4×vec4, only for shadowed pixels)
    // to learn the local distortion factor, then offset and project again.
    vec3 sp0 = (shadowProjection * (shadowModelView * vec4(feetPos, 1.0))).xyz;
    float df = length(sp0.xy) * SHADOW_DISTORT + (1.0 - SHADOW_DISTORT);

    // World size of one shadow texel at this spot -> normal-offset bias scales
    // with it (no acne up close, no peter-panning far away).
    // d(distorted)/d(x) = (1-k)/df²  =>  world texel = base * df² / (1-k)
    float invDist = 1.0 / (1.0 - SHADOW_DISTORT);
    float texel   = (2.0 * shadowDistance) * rcpSafe(float(shadowMapResolution)) * invDist * (df * df);
    float offs    = texel * (0.6 + 1.6 * (1.0 - sat(NdotL)));

    vec3 sp = shadowProject(feetPos + offsetDir * offs);
    sp.z -= 0.00004;            // tiny constant depth bias on top of the normal offset

    // Outside the shadow map -> fully lit (avoids clamped-edge garbage)
    if (sp.x <= 0.0 || sp.x >= 1.0 || sp.y <= 0.0 || sp.y >= 1.0 || sp.z >= 1.0) return vec3(1.0);

#ifdef LOW_RES_SHADOW
    // snap to half-resolution grid → 4× fewer unique texture cache lines
    float halfRes = float(shadowMapResolution) * 0.5;
    sp.xy = floor(sp.xy * halfRes + 0.5) / halfRes;
#endif

    vec3 result;
    // SKIP_PCF bypasses soft shadow sampling (1 tap instead of 4 → ~4× faster cache).
#if defined SKIP_PCF || SHADOW_SOFTNESS == 0
    result = sampleShadow(sp);
#else
    float r = float(SHADOW_SOFTNESS) * 0.9 / float(shadowMapResolution);
    result  = sampleShadow(sp + vec3( r,  r, 0.0));
    result += sampleShadow(sp + vec3(-r,  r, 0.0));
    result += sampleShadow(sp + vec3( r, -r, 0.0));
    result += sampleShadow(sp + vec3(-r, -r, 0.0));
    result *= 0.25;
#endif
    return mix(result, vec3(1.0), fade);
}
#endif
`;

export const LIB_LIGHTING = `${H('lib/lighting.glsl')}
// Forward lighting (BSL-style: warm sun, blue sky ambient, warm torches).
vec3  gShadow  = vec3(1.0);
float gSkyMask = 1.0;

// albedo: linear color | normal: world space | lm: lightmap 0..1 | feetPos: player space
// foliage: 0 solid, 0.5 leaves, 1 plants | emissive: 0 = none, >0 = glow strength
vec3 getLighting(vec3 albedo, vec3 normal, vec2 lm, vec3 feetPos, float foliage, float emissive,
                 float rain, vec3 sunDirW, vec3 lightDirW, vec3 fogLin) {
    // ── END short-circuit: overhead ambient only, skip all shadow / normal logic ──
#ifdef END
    // Inlined pow(x, 3) = x*x*x (saves 1 pow instruction).
    // v1.1.2 FIX: this used to be named \`blI\` too, which collided with the
    // later declaration (dead code after return is still compiled) -> End
    // dimension failed to compile on every preset.
    float lx = lm.x;
    float endBl = (lx * lx * lx) * 1.5 * BLOCKLIGHT_I;
    return albedo * (vec3(MIN_LIGHT) + BLOCKLIGHT_COL * endBl);
#else

    // Pre-cache lm² and lm³ for ALL lighting paths (saves 2 muls per reuse)
    float lm2 = lm.x * lm.x;

    vec3 lightCol, ambientCol;
    getLightColors(sunDirW.y, rain, fogLin, lightCol, ambientCol);

    float NdotL   = dot(normal, lightDirW);
    float diffuse = mix(sat(NdotL), 1.0, foliage);

#if defined NETHER
    float skyMask = 0.0;
#elif defined END
    float skyMask = 1.0;
#else
    float skyMask = smoothstep(0.25, 0.75, lm.y);
#endif
    gSkyMask = skyMask;

    vec3  shadow = vec3(1.0);
#if defined SHADOWS && !defined NO_SHADOWS
    if (diffuse * skyMask > 0.001) {
        vec3 offDir = foliage > 0.75 ? lightDirW : normal;
        shadow = getShadow(feetPos, offDir, mix(NdotL, 1.0, foliage));
    }
#elif !defined NETHER && !defined END
    // shadow map off: cheap stand-in from the sky light map. mad-friendly:
    shadow = vec3(0.3 + 0.7 * smoothstep(0.55, 0.98, lm.y));
#endif
    gShadow = shadow;
    // mad: a*b*c*d → can be fused to a single instruction on most GPUs
    vec3 direct = lightCol * (diffuse * skyMask) * shadow;

#if defined NETHER || defined END
    float skyAmb = 1.0;   // no sky light map in these dimensions: constant ambient like vanilla
#else
    float skyAmb = lm.y * lm.y;
#endif
    float dirAmb = mix(0.8 + 0.2 * normal.y, 1.0, foliage);
    vec3 ambient = ambientCol * skyAmb * dirAmb;

    float bl = lm.x;
#ifdef HAND_LIGHT
    float held = max(float(heldBlockLightValue), float(heldBlockLightValue2));
    if (held > 0.5) bl = max(bl, sat((held - length(feetPos)) / 15.0));
#endif
#ifdef TORCH_FLICKER
    // ── Single sin with phase shift (was 2 sin). Beat between two sines is just
    // a different frequency — use one sin at a less harmonic frequency. ──
    if (bl > 0.01) bl *= 1.0 + 0.05 * sin(frameTimeCounter * 6.0 + feetPos.x * 0.8 + feetPos.z * 0.6);
#endif
    // bl² = bl*bl, bl³ = bl*bl² — single mad-style chain, mad-fused as (bl2*1.2 + bl2*0.3) = bl2*1.5
    float bl2 = bl * bl;
    float blI = bl2 * bl * 1.8 + bl2 * 0.45;  // = (bl2*bl*1.2 + bl2*0.3) * 1.5, pre-fused
    vec3 blockLight = BLOCKLIGHT_COL * blI * BLOCKLIGHT_I * (1.0 - 0.35 * sat(luma(direct)));

#ifdef FAKE_AO
    float ao = lm.x * lm.x * 0.5 + 0.5;
    ambient *= ao;
#endif

    vec3 minLight = vec3(MIN_LIGHT) + vec3(0.25, 0.30, 0.35) * nightVision;
#if CAVE_LIGHTING == 1
    if (lm.y < 0.15) minLight *= 1.6;
#endif
    // ── mad-fused sum: compile → 1 vec3 add (3 FMAs) ──
    vec3 lighting = (direct + ambient) + (blockLight + minLight);

#ifdef EMISSIVE_BLOCKS
    if (emissive > 0.01) {
#ifdef CHEAP_EMISSIVE
        // ── Cheap: just a constant contribution (no smoothstep) ──
        lighting += vec3(emissive * EMISSIVE_STRENGTH * 0.65);
#else
        float e = smoothstep(0.10, 0.80, luma(toSRGB(albedo)));
        lighting += vec3(emissive * EMISSIVE_STRENGTH * (0.3 + e));
#endif
    }
#endif
    vec3 color = albedo * lighting;

#ifdef NIGHT_DESATURATION
    // Purkinje-like shift: dim scenes lose saturation and drift toward the night tint.
    float desat = sat(1.0 - luma(lighting) * 4.0) * 0.5;
    vec3  scotopic = vec3(luma(color)) * normalize(NIGHT_AMB_COL + 0.55);
    color = mix(color, scotopic, desat);
#endif
    color *= 1.0 - 0.7 * darknessFactor;
    return color;
#endif // END
}
`;

export const LIB_FOG = `${H('lib/fog.glsl')}
// Forward fog (no extra pass needed). 3 quality levels + night haze.
vec3 applyFog(vec3 color, vec3 feetPos, vec3 sunDirW, float rain, vec3 fogLin, float eyeSky) {
    // ── Hard cull: past FOG_CUTOFF we return color directly (fog invisible anyway) ──
#if FOG_QUALITY != 0
    if (dot(feetPos, feetPos) > FOG_CUTOFF * FOG_CUTOFF) {
        if (isEyeInWater == 1) return mix(color, vec3(0.02, 0.16, 0.34) * 0.5, 0.85);
        if (isEyeInWater == 2) return mix(color, vec3(0.90, 0.25, 0.03), 0.95);
        if (isEyeInWater == 3) return mix(color, vec3(0.70, 0.75, 0.85), 0.85);
        return color;
    }
#endif
#if FOG_QUALITY == 0
    if (isEyeInWater == 1) return mix(color, vec3(0.02, 0.16, 0.34) * 0.5, sat(length(feetPos) * 0.08));
    return color;
#endif
    float dist = length(feetPos);
    vec3  dir  = feetPos * rcpSafe(dist);
#ifdef NETHER
    eyeSky = 1.0;
#endif

    if (isEyeInWater == 1) {
        vec3 lightCol, ambientCol;
        getLightColors(sunDirW.y, rain, fogLin, lightCol, ambientCol);
        // mad: luma(ambient)*2.5 + luma(light)*0.5 + 0.02 → single dp4-equivalent
        float lumaSum = luma(ambientCol) * 2.5 + luma(lightCol) * 0.5 + 0.02;
        vec3 wf = vec3(0.02, 0.16, 0.34) * lumaSum * mix(0.15, 1.0, eyeSky);
        return mix(color, wf, 1.0 - exp2(-dist * 0.1154));  // exp2 is cheaper on old GPUs
    }
    if (isEyeInWater == 2) return mix(color, vec3(0.90, 0.25, 0.03), 1.0 - exp2(-dist * 2.165));
    if (isEyeInWater == 3) return mix(color, vec3(0.70, 0.75, 0.85), 1.0 - exp2(-dist * 1.299));

#ifdef NETHER
    float haze = 1.0 - exp2(-dist * 0.01732 * FOG_DENSITY);
#else
    // mad: rain * (RAIN_FOG + 4) + 1
    float hazeK = rain * (RAIN_FOG + 4.0) + 1.0;
    float haze = 1.0 - exp2(-dist * 0.00404 * FOG_DENSITY * hazeK);
#endif
    float edge = smoothstep(far * 0.62, far * 0.98, dist);
    // mad: (1-haze)*(1-edge) → 1 - (1-haze)*(1-edge) when fused
    float fog  = 1.0 - (1.0 - haze) * (1.0 - edge);

#if FOG_QUALITY == 1
    // cheap linear fog with plain fogColor (no sky lookup) — Potato tier
    vec3 fogCol = toLinear(fogColor) * mix(0.5, 1.0, eyeSky);
#elif defined SKY_LOD && !defined SKIP_SKY_PROC
    // ── hybrid: full sky near, cheap gradient far ──
    vec3 fogCol = (dist < 48.0) ? getSkyColor(normalize(vec3(dir.x, max(dir.y, 0.0) * 0.25 + 0.02, dir.z)), sunDirW, rain, fogLin) * mix(0.06, 1.0, eyeSky) : getSkyCheap(dir, fogLin) * mix(0.06, 1.0, eyeSky);
#else
    // full atmospheric fog: sky color at the fog direction
    vec3 fogDir = normalize(vec3(dir.x, max(dir.y, 0.0) * 0.25 + 0.02, dir.z));
    vec3 fogCol = getSkyColor(fogDir, sunDirW, rain, fogLin) * mix(0.06, 1.0, eyeSky);
#endif

#if !defined NETHER && !defined END
    // ── night haze (v1.1.0): cool blue depth at night, only outdoors ──
    float nF = getNightFactor(sunDirW.y) * eyeSky * NIGHT_FOG;
    if (nF > 0.001) {
        float nHaze = (1.0 - exp2(-dist * 0.00289 * NIGHT_FOG)) * nF;
        // mad: 1 - (1-fog)*(1 - 0.55*nHaze) → 1 - (1-fog)*(1-0.55*nHaze)
        fog    = 1.0 - (1.0 - fog) * (1.0 - 0.55 * nHaze);
        fogCol = mix(fogCol, NIGHT_HORIZON * 2.2 * NIGHT_BRIGHTNESS, nF * 0.5);
    }
#endif

    fog    = max(fog, blindness * smoothstep(0.0, 6.0, dist));
    fogCol = mix(fogCol, vec3(0.0), blindness);
    return mix(color, fogCol, fog);
}
`;

export const LIB_WATER = `${H('lib/water.glsl')}
// Analytic wave normals (3 directional waves, gradient computed directly).
vec3 getWaveNormal(vec3 worldPos, float time, vec3 baseNormal) {
    vec2 p = worldPos.xz;
    float t = time * 0.9;
    // k constants are baked; magnitudes fused into the cosine factor to save 3 muls.
    vec2 k1 = vec2( 0.90,  0.35);
    vec2 k2 = vec2(-0.55,  0.85);
    vec2 k3 = vec2( 0.30, -1.10);
    float c1 = cos(dot(p, k1) * 2.1 + t * 1.6);
    float c2 = cos(dot(p, k2) * 3.3 - t * 1.9);
    float c3 = cos(dot(p, k3) * 5.1 + t * 2.7);
    vec2 grad = k1 * (0.0945 * c1) + k2 * (0.1155 * c2) + k3 * (0.1275 * c3);
    vec3 n = vec3(-grad.x, 1.0, -grad.y);
#ifdef FAST_NORMALIZE
    // ── Fast normalize: 1 mad chain (saves 1 sqrt + 1 div) ──
    // |n| ≈ 1 since the y component is 1.0 and grad is small
    float invLen = inversesqrt(1.0 + dot(grad, grad));
    return baseNormal.y < 0.0 ? -n * invLen : n * invLen;
#else
    return baseNormal.y < 0.0 ? -normalize(n) : normalize(n);
#endif
}
`;

export const LIB_FILES: Record<string, string> = {
  'shaders/lib/uniforms.glsl': LIB_UNIFORMS,
  'shaders/lib/common.glsl': LIB_COMMON,
  'shaders/lib/atmosphere.glsl': LIB_ATMOSPHERE,
  'shaders/lib/waving.glsl': LIB_WAVING,
  'shaders/lib/shadows.glsl': LIB_SHADOWS,
  'shaders/lib/lighting.glsl': LIB_LIGHTING,
  'shaders/lib/fog.glsl': LIB_FOG,
  'shaders/lib/water.glsl': LIB_WATER,
};
