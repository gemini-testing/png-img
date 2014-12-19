#include "./PngImg.h"
#include "./PngStructs.h"

#include <png.h>
#include <string.h>
#include <memory>

using namespace std;

struct BufPtr {
    const char* ptr;
    size_t len;
};

///
void readFromBuf(png_structp pngPtr, png_bytep data, png_size_t length) {
    BufPtr* bufPtr = (BufPtr*)png_get_io_ptr(pngPtr);

    memcpy((char*)data, bufPtr->ptr, length);
    bufPtr->ptr += length;
    bufPtr->len -= length;
}

///
PngImg::PngImg(const char* buf, const size_t bufLen)
    : rowPtrs_(nullptr)
    , data_(nullptr)
{
    PngReadStruct readStruct;
    if(readStruct.Valid()) {
        BufPtr bufPtr = {buf, bufLen};
        png_set_read_fn(readStruct.pngPtr, (png_voidp)&bufPtr, readFromBuf);

        ReadInfo_(readStruct);
        ReadImg_(readStruct);
    }
}

///
PngImg::~PngImg() {
    if(rowPtrs_) delete [] rowPtrs_;
    if(data_) delete [] data_;
}

///
void PngImg::ReadInfo_(PngReadStruct& rs) {
    png_read_info(rs.pngPtr, rs.infoPtr);
    info_.width = png_get_image_width(rs.pngPtr, rs.infoPtr);
    info_.height = png_get_image_height(rs.pngPtr, rs.infoPtr);
    info_.bit_depth = png_get_bit_depth(rs.pngPtr, rs.infoPtr);
    info_.color_type = png_get_color_type(rs.pngPtr, rs.infoPtr);
    info_.interlace_type = png_get_interlace_type(rs.pngPtr, rs.infoPtr);
    info_.compression_type = png_get_compression_type(rs.pngPtr, rs.infoPtr);
    info_.filter_type = png_get_filter_type(rs.pngPtr, rs.infoPtr);
    info_.rowbytes = png_get_rowbytes(rs.pngPtr, rs.infoPtr);
    info_.pxlsize = info_.rowbytes / info_.width;
}

///
void PngImg::ReadImg_(PngReadStruct& rs) {
    rowPtrs_ = new png_bytep[info_.height];
    data_ = new char[info_.height * info_.rowbytes];

    for(size_t i = 0; i < info_.height; ++i) {
        rowPtrs_[i] = (png_bytep)data_ + i * info_.rowbytes;
    }

    png_read_image(rs.pngPtr, rowPtrs_);
}

///
unique_ptr<Pxl> PngImg::Get(png_uint_32 x, png_uint_32 y) const
{
    if(x >= info_.width || y >= info_.height)
    {
        error_ = "Out of the bounds";
        return nullptr;
    }

    png_bytep p = rowPtrs_[y] + info_.pxlsize * x;
    unique_ptr<Pxl> pPxl(new Pxl{});
    pPxl->r = p[0];
    pPxl->g = p[1];
    pPxl->b = p[2];
    pPxl->a = info_.pxlsize > 3 ? p[3] : 255;

    return pPxl;
}

///
bool PngImg::Crop(png_uint_32 offsetX, png_uint_32 offsetY, png_uint_32 width, png_uint_32 height)
{
    if(offsetX >= info_.width
    || offsetY >= info_.height
    || width == 0
    || height == 0
    || offsetX + width > info_.width
    || offsetY + height > info_.height)
    {
        error_ = "Bad arguments";
        return false;
    }

    for(size_t i = 0; i < height; ++i) {
        rowPtrs_[i] = rowPtrs_[i + offsetY] + offsetX * info_.pxlsize;
    }

    info_.width = width;
    info_.height = height;
    info_.rowbytes = info_.pxlsize * width;
    return true;
}

///
bool PngImg::Write(const string& file) {
    auto fileClose = [](FILE* fp){ if(fp) fclose(fp); };
    unique_ptr<FILE, decltype(fileClose)> fp(fopen(file.c_str(), "wb"), fileClose);
    if(!fp) {
        error_ = "Can't open file for writing";
        return false;
    }

    PngWriteStruct pws;
    if(!pws.Valid()) {
        error_ = "Can't create png structs";
        return false;
    }

    if(setjmp(png_jmpbuf(pws.pngPtr))) {
        error_ = "Can't write file";
        return false;
    }

    png_init_io(pws.pngPtr, fp.get());
    png_set_IHDR(pws.pngPtr, pws.infoPtr,
        info_.width,
        info_.height,
        info_.bit_depth,
        info_.color_type,
        info_.interlace_type,
        info_.compression_type,
        info_.filter_type
    );
    png_write_info(pws.pngPtr, pws.infoPtr);
    png_write_image(pws.pngPtr, rowPtrs_);
    png_write_end(pws.pngPtr, NULL);
    return true;
}
