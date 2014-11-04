{
  'targets': [
    {
      'target_name': 'zlib',
      'type': 'static_library',
      'sources': [
        'adler32.c',
        'compress.c',
        'crc32.c',
        'deflate.c',
        'gzclose.c',
        'gzlib.c',
        'gzread.c',
        'gzwrite.c',
        'infback.c',
        'inffast.c',
        'inflate.c',
        'inftrees.c',
        'trees.c',
        'uncompr.c',
        'zutil.c',
      ],
      'include_dirs': [
        '.'
      ],
      'defines': [
          'HAVE_STDARG_H'
      ],
      'conditions': [
        ['OS=="win"', {
          'defines': [
            'ZLIB_WINAPI'
          ]
        }, {
          'defines': [
            'HAVE_UNISTD_H'
          ]
        }]
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          '.'
        ]
      }
    }
  ]
}
