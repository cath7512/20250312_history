# Historical War Map - Korea-Japan War

An interactive historical map application that visualizes the events of the Korea-Japan War (Imjin War) from 1592-1598 with timeline controls, Wikipedia integration, and animations.

## Features

- Interactive Google Map showing historical events
- Timeline controls with playback functionality
- Wikipedia integration that synchronizes with the current event
- Animated troop movements and battle markers
- Text-to-speech narration of historical events
- Sound effects for battles and movements
- Detailed visualization of troop numbers and battle outcomes

## Setup

1. Replace `YOUR_API_KEY` in `index.html` with your actual Google Maps API key.
2. Add sound files to the root directory:
   - `battle.mp3` - Sound effect for land battles
   - `naval_battle.mp3` - Sound effect for naval battles
   - `march.mp3` - Sound effect for troop movements
   - `speech.mp3` - Background sound for narration (optional)

## Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Enable the Google Maps JavaScript API
4. Create an API key from the Credentials page
5. Restrict the API key to only the Maps JavaScript API and your domain for security

## Using the Application

- Use the dropdown to select different historical events (currently only Korea-Japan War is implemented)
- Navigate through time using the month/year inputs or the playback controls
- Click on markers to view detailed information about battles and events
- Toggle sound on/off to enable/disable narration and sound effects
- Adjust playback speed using the slider 