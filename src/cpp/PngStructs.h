#ifndef PNG_STRUCTS_H
#define PNG_STRUCTS_H

#include <png.h>
#include <functional>

typedef std::function<png_structp(png_const_charp, png_voidp, png_error_ptr, png_error_ptr)> PngStructConstructor;
typedef std::function<void(png_structpp, png_infopp)> PngStructDestructor;

///
class PngStruct {
public:
    png_structp pngPtr;
    png_infop infoPtr;

    ///
    bool Valid() const { return pngPtr && infoPtr; }

protected:
    ///
    PngStruct(PngStructConstructor constructorFn, PngStructDestructor destructorFn)
        : pngPtr(constructorFn(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL))
        , infoPtr(NULL)
        , destructorFn_(destructorFn)
    {
        if(pngPtr) {
            infoPtr = png_create_info_struct(pngPtr);
        }
    }

    ///
    ~PngStruct()
    {
        if(pngPtr) {
            destructorFn_(&pngPtr, infoPtr ? &infoPtr : (png_infopp)0);
        }
    }

private:
    PngStructDestructor destructorFn_;
};

///
class PngReadStruct
    : public PngStruct
{
public:
    ///
    PngReadStruct()
        : PngStruct(
            png_create_read_struct,
            [](png_structpp ppPng, png_infopp ppInfo){ png_destroy_read_struct(ppPng, ppInfo, (png_infopp)0); }
        )
    {}
};

///
class PngWriteStruct
    : public PngStruct
{
public:
    ///
    PngWriteStruct()
        : PngStruct(
            png_create_write_struct,
            [](png_structpp ppPng, png_infopp ppInfo){ png_destroy_write_struct(ppPng, ppInfo); }
        )
    {}
};

#endif // PNG_STRUCTS_H
