# Recruiter-AI

An automated recruitment system with virtual interviewer capabilities.

## Features

- Virtual interviewer with 3D character avatar
- Real-time audio response recording
- Tab switching proctoring
- Interview progress tracking
- Automated interview evaluation

## 3D Avatar Feature

The virtual interviewer includes a 3D character avatar that:
- Blinks eyes when idle
- Animates talking when playing audio responses
- Transitions smoothly between animations
- Works with custom .glb models

To use your own 3D character:
1. Place your .glb file in the `public/models/` directory
2. Name it `interviewer.glb`
3. Ensure it has the animations "Rig | Eyes blinking" and "Rig | cycle talking"

See the [detailed model requirements](/public/models/README.md) for more information.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
