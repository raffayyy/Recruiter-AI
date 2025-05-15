# 3D Character Model Instructions

## Model Requirements

Place your .glb 3D character model file in this directory and name it `interviewer.glb`.

The model should include the following animation clips:
- "Rig | Eyes blinking" - Default animation for idle state
- "Rig | cycle talking" - Animation that plays when the interviewer is speaking

## Model Format

- Format: glTF/GLB (.glb file)
- Recommended dimensions: Human-proportioned character
- Recommended poly count: Low to medium (10,000-50,000 polygons) for performance
- Texture resolution: 1024x1024 or 2048x2048

## Installing Your Own Model

1. Export your 3D character as a .glb file with the required animations
2. Name it `interviewer.glb`
3. Place it in this directory
4. Restart the application if necessary

## Troubleshooting

If your model doesn't animate correctly:
- Ensure animation names match exactly: "Rig | Eyes blinking" and "Rig | cycle talking"
- Check console for any errors related to animation loading
- Verify the model uses a standard skeletal rig compatible with Three.js 