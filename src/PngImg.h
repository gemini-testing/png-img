#ifndef PNG_IMG_H
#define PNG_IMG_H

#include <png.h>
#include <string>
#include <memory>

struct ImgInfo {
    png_uint_32 width;
    png_uint_32 height;
    png_uint_32 bit_depth;
    png_uint_32 color_type;
    png_uint_32 interlace_type;
    png_uint_32 compression_type;
    png_uint_32 filter_type;
    png_uint_32 rowbytes;
    short pxlsize;
};

struct Pxl {
    short r;
    short g;
    short b;
    short a;
};

class PngReadStruct;

///
class PngImg
{
public:
    PngImg(const char* buf, const size_t bufLen);
    ~PngImg();

    unsigned Width() const { return info_.width; }
    unsigned Height() const { return info_.height; }
    std::string LastError() const { return error_; }

    std::unique_ptr<Pxl> Get(png_uint_32 x, png_uint_32 y) const;
    bool Fill(png_uint_32 offsetX, png_uint_32 offsetY, png_uint_32 width, png_uint_32 height, const Pxl& pxl);
    bool Crop(png_uint_32 offsetX, png_uint_32 offsetY, png_uint_32 width, png_uint_32 height);
    bool Write(const std::string& file);

private:
    void ReadInfo_(PngReadStruct& readStruct);
    void ReadImg_(PngReadStruct& readStruct);
    bool InBounds_(png_uint_32 offsetX, png_uint_32 offsetY, png_uint_32 width, png_uint_32 height) const;
    void Set_(png_uint_32 x, png_uint_32 y, const Pxl& pxl);

    ImgInfo info_;
    png_bytep* rowPtrs_;
    char* data_;
    mutable std::string error_;
};

#endif  // PNG_IMG_H
