#ifndef PNG_IMG_H
#define PNG_IMG_H

#include <png.h>
#include <string>

struct ImgInfo {
    png_uint_32 width = 0;
    png_uint_32 height = 0;
    png_uint_32 bit_depth = 0;
    png_uint_32 color_type = 0;
    png_uint_32 interlace_type = 0;
    png_uint_32 compression_type = 0;
    png_uint_32 filter_type = 0;
    png_uint_32 rowbytes = 0;
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

    bool Crop(png_uint_32 offsetX, png_uint_32 offsetY, png_uint_32 width, png_uint_32 height);
    bool Write(const std::string& file);

private:
    void ReadInfo_(PngReadStruct& readStruct);
    void ReadImg_(PngReadStruct& readStruct);

    ImgInfo info_;
    png_bytep* rowPtrs_;
    char* data_;
    std::string error_;
};

#endif  // PNG_IMG_H
