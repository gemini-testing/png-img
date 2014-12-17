{
  'targets': [
    {
      'target_name': 'libpng',
      'type': 'static_library',
      'dependencies': [
        '../zlib/zlib.gyp:zlib'
      ],
      'conditions': [
        ['OS=="win"', {
          'defines': [
            'ZLIB_WINAPI'
          ]
        }]
      ],
      'sources': [
        'png.c',
        'pngerror.c',
        'pngget.c',
        'pngmem.c',
        'pngpread.c',
        'pngread.c',
        'pngrio.c',
        'pngrtran.c',
        'pngrutil.c',
        'pngset.c',
        'pngtest.c',
        'pngtrans.c',
        'pngwio.c',
        'pngwrite.c',
        'pngwtran.c',
        'pngwutil.c'
      ],
      'include_dirs': [
        '.'
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          '.'
        ]
      }
    }
  ]
}
