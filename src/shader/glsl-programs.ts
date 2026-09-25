// ============================================================================
//  Vivid Lite Shaders — program sources (shaders/program/*.glsl)
//  Each program is one file containing both stages, selected with VSH / FSH.
//  Tiny stub files (gbuffers_terrain.vsh etc.) just #include these.
// ============================================================================

import { AUTHOR, REPO_URL, VERSION } from './version';

const VIEW_DIR_FROM_FRAGCOORD = `    vec2 ndc = (gl_FragCoord.xy / vec2(viewWidth, viewHeight)) * 2.0 - 1.0;
    vec4 tmp = gbufferProjectionInverse * vec4(ndc, 1.0, 1.0);
    vec3 dir = normalize(mat3(gbufferModelViewInverse) * (tmp.xyz / tmp.w));`;

const H = (file: string) => `// Vivid Lite Shaders v${VERSION} — ${file}
// Author: ${AUTHOR} | ${REPO_URL}`;

export const PROG_TERRAIN = `${H('program/gbuffers_terrain.glsl')}
// Solid & cutout blocks (also block entities and cracks). Most expensive program.
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec2 lmcoord;
varying vec4 glcolor;
varying vec3 normalW;
varying vec3 feetPos;
varying vec2 matInfo;
varying vec3 sunDirW;
varying vec3 lightDirW;

#ifdef VSH
attribute vec4 mc_Entity;
attribute vec4 mc_midTexCoord;
#include "/lib/waving.glsl"

void main() {
    texcoord  = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lmcoord   = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    lmcoord   = sat((lmcoord - 0.03125) * 1.06667);
    glcolor   = gl_Color;
    normalW   = normalize(mat3(gbufferModelViewInverse) * (gl_NormalMatrix * gl_Normal));
    sunDirW   = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    lightDirW = normalize(mat3(gbufferModelViewInverse) * shadowLightPosition);

    int id = int(mc_Entity.x + 0.5);
    float foliage = 0.0;
    float emissive = 0.0;
    if (id == 10001) foliage = 1.0;
    if (id == 10002) foliage = 0.5;
    if (id == 10004 || id == 10010) emissive = 2.5;
    if (id == 10011) emissive = 0.9;
    matInfo = vec2(foliage, emissive);

    vec4 viewPos = gl_ModelViewMatrix * gl_Vertex;
    vec3 fp = (gbufferModelViewInverse * viewPos).xyz;
#if defined WAVING_PLANTS || defined WAVING_LEAVES
    vec3 wave = getWave(id, fp + cameraPosition, gl_MultiTexCoord0.t < mc_midTexCoord.t, frameTimeCounter, rainStrength);
    fp += wave;
    viewPos.xyz += mat3(gbufferModelView) * wave;
#endif
    feetPos = fp;
    gl_Position = gl_ProjectionMatrix * viewPos;
}
#endif

#ifdef FSH
#include "/lib/shadows.glsl"
#include "/lib/lighting.glsl"
#include "/lib/fog.glsl"

void main() {
    vec4 color = texture2D(gtexture, texcoord) * glcolor;
    if (color.a < 0.1) discard;

    vec3  albedo = toLinear(color.rgb);
    vec3  fogLin = toLinear(fogColor);
    float eyeSky = float(eyeBrightnessSmooth.y) / 240.0;

    vec3 lit = getLighting(albedo, normalize(normalW), lmcoord, feetPos, matInfo.x, matInfo.y, rainStrength, sunDirW, lightDirW, fogLin);
    lit = applyFog(lit, feetPos, sunDirW, rainStrength, fogLin, eyeSky);

    /* DRAWBUFFERS:0 */
    gl_FragData[0] = vec4(lit, color.a);
}
#endif
`;

export const PROG_WATER = `${H('program/gbuffers_water.glsl')}
// Water, stained glass, ice, portals (translucent pass).
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec2 lmcoord;
varying vec4 glcolor;
varying vec3 normalW;
varying vec3 feetPos;
varying float isWater;
varying float portal;
varying vec3 sunDirW;
varying vec3 lightDirW;

#ifdef VSH
attribute vec4 mc_Entity;

void main() {
    texcoord  = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lmcoord   = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    lmcoord   = sat((lmcoord - 0.03125) * 1.06667);
    glcolor   = gl_Color;
    normalW   = normalize(mat3(gbufferModelViewInverse) * (gl_NormalMatrix * gl_Normal));
    sunDirW   = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    lightDirW = normalize(mat3(gbufferModelViewInverse) * shadowLightPosition);

    int id  = int(mc_Entity.x + 0.5);
    isWater = (id == 10003) ? 1.0 : 0.0;
    portal  = (id == 10012) ? 1.0 : 0.0;

    vec4 viewPos = gl_ModelViewMatrix * gl_Vertex;
    feetPos = (gbufferModelViewInverse * viewPos).xyz;
    gl_Position = gl_ProjectionMatrix * viewPos;
}
#endif

#ifdef FSH
#include "/lib/shadows.glsl"
#include "/lib/lighting.glsl"
#include "/lib/fog.glsl"
#include "/lib/water.glsl"

void main() {
    vec4 tex   = texture2D(gtexture, texcoord);
    vec4 color = tex * glcolor;
    if (color.a < 0.01) discard;

    vec3  fogLin = toLinear(fogColor);
    float eyeSky = float(eyeBrightnessSmooth.y) / 240.0;
    vec3  normal = normalize(normalW);
    float mask   = 0.0;

    if (isWater > 0.5) {
        vec3 worldPos = feetPos + cameraPosition;
        vec3 albedo   = toLinear(glcolor.rgb) * (0.35 + 0.45 * luma(tex.rgb));
#if WATER_TINT == 1
        albedo *= vec3(0.65, 1.0, 1.15);  // tropical teal
#elif WATER_TINT == 2
        albedo *= vec3(1.1, 0.95, 0.6);   // swamp green-yellow
#endif
        float waterDist = length(feetPos);
#if defined WATER_WAVES && !defined SIMPLE_WATER
        // skip wave past CULL_DISTANCE AND past WAVE_CUTOFF — saves cos() calls
        if (abs(normal.y) > 0.5 && waterDist < CULL_DISTANCE && waterDist < WAVE_CUTOFF) {
#ifdef SMALL_WAVE   // v1.1.3: was "#if SMALL_WAVE" -> "#if with no expression" error when enabled
            // single-wave fallback (1 cos + 2 muls instead of 3 cos + 5 muls)
            float t = frameTimeCounter * 0.9;
            vec2  p = worldPos.xz;
            float c1 = cos(dot(p, vec2(0.9, 0.35)) * 2.1 + t * 1.6);
            vec3  n  = vec3(-0.0945 * 0.9 * c1, 1.0, -0.0945 * 0.35 * c1);
            normal = normalize(n);
#else
            normal = getWaveNormal(worldPos, frameTimeCounter, normal);
#endif
        }
#endif
        vec3  lit   = getLighting(albedo, normal, lmcoord, feetPos, 0.0, 0.0, rainStrength, sunDirW, lightDirW, fogLin);
        float alpha = WATER_ALPHA;

#if defined WATER_REFLECTION && !defined SIMPLE_WATER
        // also cull expensive reflection past CULL_DISTANCE
        if (waterDist < CULL_DISTANCE) {
#ifdef PRECOMPUTED_VIEW
            // Pre-compute viewDir once (was being normalized inside the block before)
            vec3 viewDir = feetPos * inversesqrt(dot(feetPos, feetPos));
#else
            vec3 viewDir = normalize(feetPos);
#endif
            vec3  n       = dot(normal, viewDir) > 0.0 ? -normal : normal;
            float NdotV   = sat(dot(-viewDir, n));
            // ── replace pow() with 3 muls (pow(x, 3) = x*x*x) ──
            float oneMinusN = 1.0 - NdotV;
            float fresnel = 0.06 + 0.94 * (oneMinusN * oneMinusN * oneMinusN);
            // ── reflect() inlined, then re-normalized (skip renormalize when possible) ──
            vec3 refl = viewDir - n * (2.0 * dot(viewDir, n));
            refl.y    = max(refl.y, 0.02);
            refl      = normalize(refl);

            vec3 lightCol, ambientCol;
            getLightColors(sunDirW.y, rainStrength, fogLin, lightCol, ambientCol);
            float skyVis  = smoothstep(0.3, 0.9, lmcoord.y);
            vec3  reflCol = getSkyColor(refl, sunDirW, rainStrength, fogLin) * skyVis;
#ifndef SKIP_SPECULAR
            float spec    = pow(sat(dot(refl, lightDirW)), 180.0) * 2.0;
            vec3  specular = lightCol * spec * gShadow * gSkyMask;
#else
            vec3  specular = vec3(0.0);
#endif

            if (isEyeInWater == 1) { fresnel *= 0.3; reflCol = lit; }
            lit   = mix(lit, reflCol, fresnel) + specular;
            alpha = mix(alpha, 1.0, fresnel);
        }
#endif
        color = vec4(lit, alpha);
        mask  = 1.0;
    } else {
        vec3 albedo = toLinear(color.rgb);
        color.rgb = getLighting(albedo, normal, lmcoord, feetPos, 0.0, portal * 2.0, rainStrength, sunDirW, lightDirW, fogLin);
    }
    color.rgb = applyFog(color.rgb, feetPos, sunDirW, rainStrength, fogLin, eyeSky);

    /* DRAWBUFFERS:02 */
    gl_FragData[0] = color;
    gl_FragData[1] = vec4(mask, 0.0, lmcoord.y * mask, color.a * mask);
}
#endif
`;

export const PROG_ENTITIES = `${H('program/gbuffers_entities.glsl')}
// Mobs, players, items (and the hand with HAND defined).
#ifdef HAND
    #define NO_SHADOWS
#endif
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec2 lmcoord;
varying vec4 glcolor;
varying vec3 normalW;
varying vec3 feetPos;
varying vec3 sunDirW;
varying vec3 lightDirW;

#ifdef VSH
void main() {
    texcoord  = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lmcoord   = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    lmcoord   = sat((lmcoord - 0.03125) * 1.06667);
    glcolor   = gl_Color;
    normalW   = normalize(mat3(gbufferModelViewInverse) * (gl_NormalMatrix * gl_Normal));
    sunDirW   = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    lightDirW = normalize(mat3(gbufferModelViewInverse) * shadowLightPosition);
    feetPos   = (gbufferModelViewInverse * (gl_ModelViewMatrix * gl_Vertex)).xyz;
    gl_Position = ftransform();
}
#endif

#ifdef FSH
#include "/lib/shadows.glsl"
#include "/lib/lighting.glsl"
#include "/lib/fog.glsl"

void main() {
    vec4 color = texture2D(gtexture, texcoord) * glcolor;
    color.rgb  = mix(color.rgb, entityColor.rgb, entityColor.a);
    if (color.a < 0.1) discard;

    vec3  fogLin = toLinear(fogColor);
    float eyeSky = float(eyeBrightnessSmooth.y) / 240.0;

    vec3 lit = getLighting(toLinear(color.rgb), normalize(normalW), lmcoord, feetPos, 0.0, 0.0, rainStrength, sunDirW, lightDirW, fogLin);
    lit = applyFog(lit, feetPos, sunDirW, rainStrength, fogLin, eyeSky);

    /* DRAWBUFFERS:0 */
    gl_FragData[0] = vec4(lit, color.a);
}
#endif
`;

export const PROG_TEXTURED_LIT = `${H('program/gbuffers_textured_lit.glsl')}
// Particles and other lit billboards (no shadow lookups: cheap).
#define NO_SHADOWS
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec2 lmcoord;
varying vec4 glcolor;
varying vec3 feetPos;
varying vec3 sunDirW;
varying vec3 lightDirW;

#ifdef VSH
void main() {
    texcoord  = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lmcoord   = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    lmcoord   = sat((lmcoord - 0.03125) * 1.06667);
    glcolor   = gl_Color;
    sunDirW   = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    lightDirW = normalize(mat3(gbufferModelViewInverse) * shadowLightPosition);
    feetPos   = (gbufferModelViewInverse * (gl_ModelViewMatrix * gl_Vertex)).xyz;
    gl_Position = ftransform();
}
#endif

#ifdef FSH
#include "/lib/shadows.glsl"
#include "/lib/lighting.glsl"
#include "/lib/fog.glsl"

void main() {
    vec4 color = texture2D(gtexture, texcoord) * glcolor;
    if (color.a < 0.01) discard;

    vec3  fogLin = toLinear(fogColor);
    float eyeSky = float(eyeBrightnessSmooth.y) / 240.0;

    // Use unit up vector directly — saves 1 normalize() in the hottest path (particles)
    vec3 lit = getLighting(toLinear(color.rgb), vec3(0.0, 1.0, 0.0), lmcoord, feetPos, 1.0, 0.0, rainStrength, sunDirW, lightDirW, fogLin);
    lit = applyFog(lit, feetPos, sunDirW, rainStrength, fogLin, eyeSky);

    /* DRAWBUFFERS:0 */
    gl_FragData[0] = vec4(lit, color.a);
}
#endif
`;

export const PROG_TEXTURED = `${H('program/gbuffers_textured.glsl')}
// Unlit textured things (beacon beam, enchant glint, spider eyes).
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"

varying vec2 texcoord;
varying vec4 glcolor;

#ifdef VSH
void main() {
    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    glcolor  = gl_Color;
    gl_Position = ftransform();
}
#endif

#ifdef FSH
void main() {
    vec4 color = texture2D(gtexture, texcoord) * glcolor;
    if (color.a < 0.01) discard;
    color.rgb = toLinear(color.rgb) * 1.5;
    /* DRAWBUFFERS:0 */
    gl_FragData[0] = color;
}
#endif
`;

export const PROG_BASIC = `${H('program/gbuffers_basic.glsl')}
// Lines, block selection outline, leads, world border.
#include "/lib/common.glsl"

varying vec4 glcolor;

#ifdef VSH
void main() {
    glcolor = gl_Color;
    gl_Position = ftransform();
}
#endif

#ifdef FSH
void main() {
    vec4 color = glcolor;
    color.rgb = toLinear(color.rgb);
    /* DRAWBUFFERS:0 */
    gl_FragData[0] = color;
}
#endif
`;

export const PROG_SKYBASIC = `${H('program/gbuffers_skybasic.glsl')}
// Procedural sky gradient, round sun, stars, Milky Way, moon halo.
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec4 glcolor;
varying vec3 sunDirW;

#ifdef VSH
void main() {
    glcolor = gl_Color;
    sunDirW = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    gl_Position = ftransform();
}
#endif

#ifdef FSH
void main() {
    // vanilla stars and the sunset band are drawn with alpha < 1: we replace them with our own
    if (glcolor.a < 0.99) discard;

${VIEW_DIR_FROM_FRAGCOORD}
    vec3 fogLin = toLinear(fogColor);
    vec3 sky = getSkyColor(dir, sunDirW, rainStrength, fogLin);

#if !defined NETHER && !defined END
    vec3 lightCol, ambientCol;
    getLightColors(sunDirW.y, rainStrength, fogLin, lightCol, ambientCol);
#ifdef ROUND_SUN
    float disk = smoothstep(0.99880, 0.99935, dot(dir, sunDirW));
    sky += disk * (lightCol * 6.0 + vec3(0.15)) * (1.0 - rainStrength) * step(-0.03, dir.y);
#endif
#ifdef STARS
    // ── star field: two layers + twinkle + optional Milky Way band ──
    // Pre-cache: single mad for the night gate
    float starsF = getNightFactor(sunDirW.y) * (1.0 - rainStrength) * smoothstep(-0.02, 0.18, dir.y);
    if (starsF > 0.0 && STAR_BRIGHTNESS > 0.001 && starsF > 0.01) {
        // bright layer
        vec3  p1 = dir * 110.0;
        float h1 = hash13(floor(p1));
        float d1 = length(fract(p1) - 0.5);
        float s1 = step(0.9955, h1) * (1.0 - smoothstep(0.04, 0.30, d1));
        s1 *= 0.55 + 0.45 * sin(frameTimeCounter * 2.2 + h1 * 210.0);

        // faint dense layer (adds depth for almost no cost)
        vec3  p2 = dir * 260.0;
        float h2 = hash13(floor(p2) + 37.0);
        float d2 = length(fract(p2) - 0.5);
        float s2 = step(0.9975, h2) * (1.0 - smoothstep(0.06, 0.34, d2)) * 0.45;
        s2 *= 0.6 + 0.4 * sin(frameTimeCounter * 1.4 + h2 * 130.0);

        // slight color variation: warm / cool stars
        vec3 starTint = mix(vec3(0.75, 0.84, 1.00), vec3(1.00, 0.88, 0.74), fract(h1 * 7.31));

        float band = 1.0;
#ifdef MILKY_WAY
        // galactic band: a soft stripe across a fixed sky axis
        vec3  axis = normalize(vec3(0.55, 0.32, -0.77));
        float bd   = 1.0 - abs(dot(dir, axis));
        float mw   = pow(sat(bd), 14.0);
        // clumpiness from the same hash — no extra texture, no noise texture needed
        mw *= 0.55 + 0.45 * hash13(floor(dir * 24.0));
        sky += NIGHT_LIGHT_COL * mw * 0.055 * starsF * STAR_BRIGHTNESS;
        band = 1.0 + mw * 1.8;   // more stars inside the band
#endif
        sky += starTint * (s1 + s2) * band * 0.55 * starsF * STAR_BRIGHTNESS;
    }
#endif
#endif

    /* DRAWBUFFERS:02 */
    gl_FragData[0] = vec4(sky, 1.0);
    gl_FragData[1] = vec4(0.0, 1.0, 0.0, 1.0);
}
#endif
`;

export const PROG_SKYTEXTURED = `${H('program/gbuffers_skytextured.glsl')}
// The moon (vanilla sun is hidden), End sky.
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec4 glcolor;
varying vec3 sunDirW;

#ifdef VSH
void main() {
    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    glcolor  = gl_Color;
    sunDirW  = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    gl_Position = ftransform();
}
#endif

#ifdef FSH
void main() {
    vec4 tex = texture2D(gtexture, texcoord) * glcolor;
#ifdef END
${VIEW_DIR_FROM_FRAGCOORD}
    vec3 sky = getSkyColor(dir, sunDirW, 0.0, toLinear(fogColor));
    vec4 color = vec4(sky + toLinear(tex.rgb) * 0.35, 1.0);
#else
    vec4 color = vec4(toLinear(tex.rgb) * 2.5 * (1.0 - rainStrength), tex.a);
#endif
    /* DRAWBUFFERS:02 */
    gl_FragData[0] = color;
    gl_FragData[1] = vec4(0.0, 1.0, 0.0, 1.0);
}
#endif
`;

export const PROG_CLOUDS = `${H('program/gbuffers_clouds.glsl')}
// Vanilla clouds, lit by our sky and sun colors.
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec4 glcolor;
varying vec3 feetPos;
varying vec3 sunDirW;

#ifdef VSH
void main() {
    glcolor = gl_Color;
    sunDirW = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    feetPos = (gbufferModelViewInverse * (gl_ModelViewMatrix * gl_Vertex)).xyz;
    gl_Position = ftransform();
}
#endif

#ifdef FSH
#include "/lib/fog.glsl"

void main() {
    vec4 color = glcolor;
    if (color.a < 0.05) discard;

    vec3 fogLin = toLinear(fogColor);
    vec3 lightCol, ambientCol;
    getLightColors(sunDirW.y, rainStrength, fogLin, lightCol, ambientCol);

    vec3 lit = toLinear(color.rgb) * (ambientCol * 1.7 + lightCol * 0.55 + vec3(0.02));
#ifdef CLOUD_TRANSLUCENCY
    lit += toLinear(color.rgb) * lightCol * 0.3 * smoothstep(0.0, 0.2, sunDirW.y);
#endif
    lit = applyFog(lit, feetPos, sunDirW, rainStrength, fogLin, 1.0);

    /* DRAWBUFFERS:02 */
    gl_FragData[0] = vec4(lit, color.a * 0.9);
    gl_FragData[1] = vec4(0.0, 1.0, 0.0, 1.0);
}
#endif
`;

export const PROG_WEATHER = `${H('program/gbuffers_weather.glsl')}
// Rain and snow.
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec2 lmcoord;
varying vec4 glcolor;
varying vec3 feetPos;
varying vec3 sunDirW;

#ifdef VSH
void main() {
    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    lmcoord  = (gl_TextureMatrix[1] * gl_MultiTexCoord1).xy;
    lmcoord  = sat((lmcoord - 0.03125) * 1.06667);
    glcolor  = gl_Color;
    sunDirW  = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    feetPos  = (gbufferModelViewInverse * (gl_ModelViewMatrix * gl_Vertex)).xyz;
    gl_Position = ftransform();
}
#endif

#ifdef FSH
#include "/lib/fog.glsl"

void main() {
    vec4 color = texture2D(gtexture, texcoord) * glcolor;
    if (color.a < 0.01) discard;

    vec3 fogLin = toLinear(fogColor);
    vec3 lightCol, ambientCol;
    getLightColors(sunDirW.y, rainStrength, fogLin, lightCol, ambientCol);

    float bl  = lmcoord.x;
    vec3  lit = toLinear(color.rgb) * (ambientCol * 1.4 + lightCol * 0.25 + BLOCKLIGHT_COL * bl * bl * 0.8 + vec3(0.02));
    lit = applyFog(lit, feetPos, sunDirW, rainStrength, fogLin, float(eyeBrightnessSmooth.y) / 240.0);

    /* DRAWBUFFERS:0 */
    gl_FragData[0] = vec4(lit, color.a * 0.6);
}
#endif
`;

export const PROG_SHADOW = `${H('program/shadow.glsl')}
// Shadow map pass (depth + tint for colored shadows), with waving plants.
#include "/lib/common.glsl"

uniform sampler2D gtexture;
uniform mat4 shadowModelView;
uniform mat4 shadowModelViewInverse;
uniform vec3 cameraPosition;
uniform float frameTimeCounter;
uniform float rainStrength;

varying vec2 texcoord;
varying vec4 glcolor;

#ifdef VSH
attribute vec4 mc_Entity;
attribute vec4 mc_midTexCoord;
#include "/lib/waving.glsl"

void main() {
    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;
    glcolor  = gl_Color;

    vec4 viewPos = gl_ModelViewMatrix * gl_Vertex;
#if defined WAVING_PLANTS || defined WAVING_LEAVES
    int  id = int(mc_Entity.x + 0.5);
    vec3 fp = (shadowModelViewInverse * viewPos).xyz;
    vec3 wave = getWave(id, fp + cameraPosition, gl_MultiTexCoord0.t < mc_midTexCoord.t, frameTimeCounter, rainStrength);
    viewPos.xyz += mat3(shadowModelView) * wave;
#endif
    vec4 pos = gl_ProjectionMatrix * viewPos;

    // the same distortion used when sampling: more texels close to the player
    float df = length(pos.xy) * SHADOW_DISTORT + (1.0 - SHADOW_DISTORT);
    pos.xy /= df;
    pos.z  *= 0.2;
    gl_Position = pos;
}
#endif

#ifdef FSH
void main() {
    vec4 color = texture2D(gtexture, texcoord) * glcolor;
    if (color.a < 0.1) discard;
    gl_FragData[0] = vec4(mix(vec3(1.0), color.rgb, color.a * 0.85), 1.0);
}
#endif
`;

export const PROG_COMPOSITE = `${H('program/composite.glsl')}
// Water depth fog. The only pass that reads the depth buffer (WATER_FOG option).
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec3 sunDirW;

#ifdef VSH
void main() {
    texcoord = gl_MultiTexCoord0.xy;
    sunDirW  = normalize(mat3(gbufferModelViewInverse) * sunPosition);
    gl_Position = ftransform();
}
#endif

#ifdef FSH
uniform sampler2D colortex0;
uniform sampler2D colortex2;
uniform sampler2D depthtex0;
uniform sampler2D depthtex1;

vec3 screenToView(vec2 uv, float depth) {
    vec4 v = gbufferProjectionInverse * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    return v.xyz / v.w;
}

void main() {
    vec3 color = texture2D(colortex0, texcoord).rgb;
#ifdef WATER_FOG
    vec4 mask  = texture2D(colortex2, texcoord);

    if (mask.r > 0.02 && isEyeInWater == 0) {
        float z0 = texture2D(depthtex0, texcoord).r;
        float z1 = texture2D(depthtex1, texcoord).r;
        if (z1 > z0) {
            float d = min(length(screenToView(texcoord, z1) - screenToView(texcoord, z0)), 96.0);
            vec3 lightCol, ambientCol;
            getLightColors(sunDirW.y, rainStrength, toLinear(fogColor), lightCol, ambientCol);
            float skyAtWater = sat(mask.b / max(mask.r, 0.02));
            vec3  fogCol = vec3(0.02, 0.16, 0.34) * (luma(ambientCol) * 2.5 + luma(lightCol) * 0.6 + 0.01) * mix(0.1, 1.0, skyAtWater);
            float f = 1.0 - exp(-d * 0.10);
            f *= sat((1.0 - mask.r) / (1.0 - WATER_ALPHA + 0.001));
            color = mix(color, fogCol, f * 0.92);
        }
    }
#endif

    /* DRAWBUFFERS:0 */
    gl_FragData[0] = vec4(color, 1.0);
}
#endif
`;

export const PROG_COMPOSITE1 = `${H('program/composite1.glsl')}
// Bloom. Two small blurred tiles (1/4 and 1/16 res) read from the mip chain.
// (the .fsh stub enables GL_ARB_shader_texture_lod for texture2DLod)
// so the whole effect costs a fraction of one full-screen pass. Disabled entirely when BLOOM is off.
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"

const bool colortex0MipmapEnabled = true;

varying vec2 texcoord;

#ifdef VSH
void main() {
    texcoord = gl_MultiTexCoord0.xy;
    gl_Position = ftransform();
}
#endif

#ifdef FSH
uniform sampler2D colortex0;

vec3 bloomTile(vec2 uv, float lod, float scale) {
    vec2 px  = vec2(1.0 / viewWidth, 1.0 / viewHeight) * scale;
    vec3 sum = vec3(0.0);
#ifdef HALF_RES_BLOOM
    // ── 3×3 instead of 5×5 (cheaper, slightly less smooth) ──
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 suv = clamp(uv + vec2(float(x), float(y)) * px, px * 0.5, 1.0 - px * 0.5);
            vec3 c = texture2DLod(colortex0, suv, lod).rgb;
            c *= smoothstep(0.25, 1.5, luma(c));
            sum += c;
        }
    }
    return sum / 9.0;
#else
    for (int x = -2; x <= 2; x++) {
        float wx = 1.0;
        if (x == 0) wx = 6.0; else if (x == 1 || x == -1) wx = 4.0;
        for (int y = -2; y <= 2; y++) {
            float wy = 1.0;
            if (y == 0) wy = 6.0; else if (y == 1 || y == -1) wy = 4.0;
            vec2 suv = clamp(uv + vec2(float(x), float(y)) * px, px * 0.5, 1.0 - px * 0.5);
            vec3 c = texture2DLod(colortex0, suv, lod).rgb;
            c *= smoothstep(0.25, 1.5, luma(c));
            sum += c * (wx * wy);
        }
    }
    return sum / 256.0;
#endif
}

void main() {
    vec3 res = vec3(0.0);
    if (texcoord.x < 0.25 && texcoord.y < 0.25) {
        res = bloomTile(texcoord * 4.0, 2.0, 4.0);
    } else if (texcoord.x >= 0.3 && texcoord.x < 0.3625 && texcoord.y < 0.0625) {
        res = bloomTile((texcoord - vec2(0.3, 0.0)) * 16.0, 4.0, 16.0);
    }
    /* DRAWBUFFERS:1 */
    gl_FragData[0] = vec4(res, 1.0);
}
#endif
`;

export const PROG_FINAL = `${H('program/final.glsl')}
// Bloom merge, tonemap, BSL-style color grading, vignette, dithering, color temp.
#include "/lib/uniforms.glsl"
#include "/lib/common.glsl"
#include "/lib/atmosphere.glsl"

varying vec2 texcoord;
varying vec3 sunDirW;
varying float gradeWarm;   // golden-hour weight, computed per VERTEX (4 verts) not per pixel

#ifdef VSH
void main() {
    texcoord = gl_MultiTexCoord0.xy;
    sunDirW  = normalize(mat3(gbufferModelViewInverse) * sunPosition);
#if defined COLOR_GRADING && !defined NETHER && !defined END
    // Sunset factor * (1 - rain): identical for the whole frame, so evaluating it
    // in the vertex stage makes the golden-hour term free in the fragment stage.
    gradeWarm = getSunsetFactor(sunDirW.y) * (1.0 - rainStrength) * GRADE_SUNSET;
#else
    gradeWarm = 0.0;
#endif
    gl_Position = ftransform();
}
#endif

#ifdef FSH
uniform sampler2D colortex0;
uniform sampler2D colortex1;
uniform sampler2D colortex2;
uniform sampler2D depthtex0;

vec3 tonemapVivid(vec3 c) {
    c = c / pow(pow(c, vec3(1.7)) + 1.0, vec3(1.0 / 1.7));
    return pow(c, vec3(1.10));
}

vec3 tonemapACES(vec3 x) {
    return sat((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14));
}

void main() {
    vec3  color = texture2D(colortex0, texcoord).rgb;
    float depth = texture2D(depthtex0, texcoord).r;
    float skyM  = texture2D(colortex2, texcoord).g;

    // sky pixels vanilla never covered (below the horizon, the Nether) get our sky
    if (depth >= 1.0 && skyM < 0.5) {
#ifdef SKIP_SKY_PROC
        // ultra-cheap: 2-color vertical gradient (Extra Potato mode)
        float t = sat(gl_FragCoord.y / viewHeight);
        color = mix(toLinear(fogColor) * 0.9, toLinear(fogColor) * 1.5, t);
#else
        vec4 tmp = gbufferProjectionInverse * vec4(texcoord * 2.0 - 1.0, 1.0, 1.0);
        vec3 dir = normalize(mat3(gbufferModelViewInverse) * (tmp.xyz / tmp.w));
        color = getSkyColor(dir, sunDirW, rainStrength, toLinear(fogColor));
#endif
        if (isEyeInWater == 1) color = mix(color, vec3(0.02, 0.16, 0.34) * 0.8, 0.85);
        if (isEyeInWater == 2) color = vec3(0.90, 0.25, 0.03);
    }

#ifdef BLOOM
    vec3 bloom = texture2D(colortex1, texcoord * 0.25).rgb * 0.55
               + texture2D(colortex1, texcoord * 0.0625 + vec2(0.3, 0.0)).rgb * 0.45;
    color += bloom * (BLOOM_STRENGTH * 2.0);
#endif

    color *= EXPOSURE;
#ifdef SKIP_TONEMAP
    // just clamp + gamma. Cheapest path (Extra Potato).
    color = sat(color);
#else
    #if TONEMAP == 1
        color = tonemapVivid(color);
    #elif TONEMAP == 2
        color = tonemapACES(color);
    #else
        color = sat(color);
    #endif
#endif
    color = toSRGB(color);

#ifdef COLOR_GRADING
    // ── BSL grade (v1.1.3) ────────────────────────────────────────────────
    // Why Extra High looked pale: additive bloom + fog raise the black floor,
    // and the old linear contrast ((c-0.5)*k+0.5) clips highlights before it
    // deepens shadows. This block fixes both for ~12 ALU/pixel, no texture
    // reads, no extra pass. Every GRADE_* is a literal #define, so the tint
    // vectors below are constant-folded by the compiler.
    color = sat(color);

    // 1) Black point: remap [GRADE_BLACK, 1] -> [0, 1]. One mad per channel.
    color = sat((color - GRADE_BLACK) * (1.0 / (1.0 - GRADE_BLACK)));

    // 2) Split toning, the BSL signature: shadows lean blue, highlights lean
    //    warm. Weight by perceptual luma, so blue shadows / warm torches survive.
    float gL  = luma(color);
    float gHi = smoothstep(0.18, 0.80, gL);
    vec3  shTint = mix(vec3(1.0), vec3(0.90, 0.97, 1.12), GRADE_SPLIT);
    // highlight tint keeps most of the blue channel so a bright sky stays blue
    // (a stronger blue cut turned the sky teal and white clouds peach at noon)
    vec3  hiTint = mix(vec3(1.0), vec3(1.06, 1.00, 0.95), GRADE_SPLIT);
    color *= mix(shTint, hiTint, gHi);

    // 3) Golden hour: extra orange only on the lit part of the image, only
    //    around sunrise/sunset, faded out by rain (weight from the vertex stage).
    color *= mix(vec3(1.0), vec3(1.10, 0.99, 0.86), gradeWarm * gHi);

    // 4) Filmic S-curve: mix toward smoothstep(0,1,c) = c²(3-2c). Deepens
    //    shadows and enriches mids while 0 and 1 stay fixed (no clipping).
    color = sat(color);
    color = mix(color, color * color * (3.0 - 2.0 * color), GRADE_CURVE);
#endif

    float l = luma(color);
    float s = max(max(color.r, color.g), color.b) - min(min(color.r, color.g), color.b);
    color = mix(vec3(l), color, SATURATION + VIBRANCE * (1.0 - s));
    color = (color - 0.5) * CONTRAST + 0.5;

#ifdef VIGNETTE
    float v = length((texcoord - 0.5) * vec2(1.0, 0.85));
    color *= 1.0 - VIGNETTE_STRENGTH * 0.6 * smoothstep(0.4, 0.95, v);
#endif

#ifndef NO_COLOR_TEMP
    // color temperature shift (warm = amber, cool = blue)
    color = mix(color, color * vec3(1.12, 1.04, 0.88), sat(COLOR_TEMP));
    color = mix(color, color * vec3(0.88, 0.96, 1.15), sat(-COLOR_TEMP));
#endif

#ifndef SKIP_DITHERING
    color += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
#endif
    gl_FragColor = vec4(sat(color), 1.0);
}
#endif
`;

export const PROGRAM_FILES: Record<string, string> = {
  'shaders/program/gbuffers_terrain.glsl': PROG_TERRAIN,
  'shaders/program/gbuffers_water.glsl': PROG_WATER,
  'shaders/program/gbuffers_entities.glsl': PROG_ENTITIES,
  'shaders/program/gbuffers_textured_lit.glsl': PROG_TEXTURED_LIT,
  'shaders/program/gbuffers_textured.glsl': PROG_TEXTURED,
  'shaders/program/gbuffers_basic.glsl': PROG_BASIC,
  'shaders/program/gbuffers_skybasic.glsl': PROG_SKYBASIC,
  'shaders/program/gbuffers_skytextured.glsl': PROG_SKYTEXTURED,
  'shaders/program/gbuffers_clouds.glsl': PROG_CLOUDS,
  'shaders/program/gbuffers_weather.glsl': PROG_WEATHER,
  'shaders/program/shadow.glsl': PROG_SHADOW,
  'shaders/program/composite.glsl': PROG_COMPOSITE,
  'shaders/program/composite1.glsl': PROG_COMPOSITE1,
  'shaders/program/final.glsl': PROG_FINAL,
};
