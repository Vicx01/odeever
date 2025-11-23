from PIL import Image, ImageOps, ImageDraw
import sys

def make_round(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # Create a circular mask
        mask = Image.new('L', img.size, 0)
        draw = ImageDraw.Draw(mask) 
        draw.ellipse((0, 0) + img.size, fill=255)
        
        # Apply the mask
        output = ImageOps.fit(img, mask.size, centering=(0.5, 0.5))
        output.putalpha(mask)
        
        output.save(output_path)
        print(f"Successfully created {output_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    make_round("assets/logo.png", "assets/favicon-rounded.png")
