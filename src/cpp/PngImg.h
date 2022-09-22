#ifndef PNG_IMG_H
#define PNG_IMG_H

#include <png.h>
#include <string>
#include <memory>
#include <vector>
#include <functional>

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

struct Point {
    size_t x;
    size_t y;
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
    void SetSize(png_uint_32 width, png_uint_32 height);
    void Insert(const PngImg& img, png_uint_32 offsetX, png_uint_32 offsetY);
    void RotateRight();
    void RotateLeft();
    bool Write(const std::string& file) const;

private:
    void ReadInfo_(PngReadStruct& readStruct);
    void InitStorage_();
    bool InBounds_(png_uint_32 offsetX, png_uint_32 offsetY, png_uint_32 width, png_uint_32 height) const;
    void Set_(png_uint_32 x, png_uint_32 y, const Pxl& pxl);
    void CopyRows_(const std::vector<png_bytep>& rowPtrs, const size_t numRows, const size_t rowLen,
        png_uint_32 offsetX = 0, png_uint_32 offsetY = 0);
    void CopyPxlByPxl_(const PngImg& img, png_uint_32 offsetX, png_uint_32 offsetY);
    void Rotate_(std::function<Point(const Point&, const ImgInfo&)> moveFn);

    ImgInfo info_;
    std::vector<png_bytep> rowPtrs_;
    png_bytep data_;
    mutable std::string error_;
};

#endif  // PNG_IMG_H
