"""
Convert .ai or .tiff to PNG.
Usage: python convert-image.py <input_path> <output_path>
"""
import sys
from pathlib import Path

def convert(src: str, dst: str):
    ext = Path(src).suffix.lower()
    if ext == ".ai":
        import fitz
        doc = fitz.open(src)
        page = doc[0]
        mat = fitz.Matrix(3, 3)  # 3x scale for high resolution
        pix = page.get_pixmap(matrix=mat, alpha=True)
        pix.save(dst)
    elif ext in (".tiff", ".tif"):
        from PIL import Image
        img = Image.open(src)
        img = img.convert("RGBA")
        img.save(dst, format="PNG")
    else:
        raise ValueError(f"Unsupported format: {ext}")

if __name__ == "__main__":
    convert(sys.argv[1], sys.argv[2])
    print("OK")
