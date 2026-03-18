# Crystal Bead Images

This folder contains images for the crystal beads used in the bracelet builder.

## How to Add Crystal Images

1. Save your crystal bead images in this folder (`/public/crystals/`)
2. Name them exactly as specified below (case-sensitive)
3. Recommended format: JPG or PNG
4. Recommended size: At least 200x200 pixels for clear display

## Required Image Files

- `amethyst.jpg` - Purple amethyst crystal bead
- `rose-quartz.jpg` - Pink rose quartz crystal bead
- `clear-quartz.jpg` - Clear/white quartz crystal bead
- `tigers-eye.jpg` - Golden brown tiger's eye crystal bead
- `lapis-lazuli.jpg` - Deep blue lapis lazuli crystal bead
- `jade.jpg` - Green jade crystal bead
- `citrine.jpg` - Yellow citrine crystal bead
- `obsidian.jpg` - Black obsidian crystal bead
- `moonstone.jpg` - White/grey moonstone crystal bead
- `carnelian.jpg` - Orange/red carnelian crystal bead

## Uploading Images

### Option 1: Direct File Upload
1. Click the "Upload" button in your file explorer
2. Navigate to `/public/crystals/` folder
3. Upload your images with the correct names

### Option 2: Drag and Drop (if supported)
1. Open the `/public/crystals/` folder in your file explorer
2. Drag your crystal images from your computer into this folder

### Option 3: Via Git
```bash
# Copy your images to the crystals folder
cp /path/to/your/images/*.jpg public/crystals/

# Add and commit
git add public/crystals/
git commit -m "Add crystal bead images"
```

## Image Tips

- Use high-quality photos showing the crystal's texture and color
- Crop images to show just the bead/crystal
- Square images work best for circular display
- Transparent backgrounds (PNG) can create a cleaner look

## Fallback Display

If an image is missing, the app will automatically show a colored circle gradient as a fallback based on the crystal's defined color scheme.
