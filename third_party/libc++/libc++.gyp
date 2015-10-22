# Copyright 2015 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.
{
  'targets': [
    {
      'target_name': 'libcxx_proxy',
      'type': 'none',
      'toolsets': ['host', 'target'],
      'conditions': [
        ['OS=="linux"', {
          'dependencies=': [
            'libc++',
          ],

          # Do not add dependency on libc++.so to dependents of this target. We
          # don't want to pass libc++.so on the command line to the linker, as that
          # would cause it to be linked into C executables which don't need it.
          # Instead, we supply -stdlib=libc++ and let the clang driver decide.
          'dependencies_traverse': 0,
          'variables': {
            # Don't add this target to the dependencies of targets with type=none.
            'link_dependency': 1,
          },
          'all_dependent_settings': {
            'target_conditions': [
              ['_type!="none" and OS=="linux"', {
                'include_dirs': [
                  './libcxx/include',
                  '../libc++abi/libcxxabi/include',
                ],
                'cflags_cc': [
                  '-nostdinc++',
                ],
                'ldflags': [
                  '-stdlib=libc++',

                  # Normally the generator takes care of RPATH. Our case is special
                  # because the generator is unaware of the libc++.so dependency.
                  # Note that setting RPATH here is a potential security issue. See:
                  # https://code.google.com/p/gyp/issues/detail?id=315
                  '-Wl,-R,\$$ORIGIN/lib/',
                ],
                'library_dirs': [
                  '<(PRODUCT_DIR)/lib/',
                ],
              }],
            ],
          }
        }]
      ]
    },
    {
      'target_name': 'libc++',
      'type': 'static_library',
      'toolsets': ['host', 'target'],
      'dependencies=': [
        # libc++abi is linked statically into libc++.so. This allows us to get
        # both libc++ and libc++abi by passing '-stdlib=libc++'. If libc++abi
        # was a separate DSO, we'd have to link against it explicitly.
        '../libc++abi/libc++abi.gyp:libc++abi',
      ],
      'sources': [
        './libcxx/src/algorithm.cpp',
        './libcxx/src/bind.cpp',
        './libcxx/src/chrono.cpp',
        './libcxx/src/condition_variable.cpp',
        './libcxx/src/debug.cpp',
        './libcxx/src/exception.cpp',
        './libcxx/src/future.cpp',
        './libcxx/src/hash.cpp',
        './libcxx/src/ios.cpp',
        './libcxx/src/iostream.cpp',
        './libcxx/src/locale.cpp',
        './libcxx/src/memory.cpp',
        './libcxx/src/mutex.cpp',
        './libcxx/src/new.cpp',
        './libcxx/src/optional.cpp',
        './libcxx/src/random.cpp',
        './libcxx/src/regex.cpp',
        './libcxx/src/shared_mutex.cpp',
        './libcxx/src/stdexcept.cpp',
        './libcxx/src/string.cpp',
        './libcxx/src/strstream.cpp',
        './libcxx/src/system_error.cpp',
        './libcxx/src/thread.cpp',
        './libcxx/src/typeinfo.cpp',
        './libcxx/src/utility.cpp',
        './libcxx/src/valarray.cpp',
      ],
      'include_dirs': [
        './libcxx/include',
        '../libc++abi/libcxxabi/include',
      ],
      'cflags': [
        '-fPIC',
        '-fstrict-aliasing',
        '-nostdinc++',
        '-pthread',
        '-std=c++11'
      ],
      'cflags_cc!': [
        '-fno-exceptions',
        '-fno-rtti',
      ],
      'cflags!': [
        '-fvisibility=hidden',
      ],
      'ldflags': [
        '-nodefaultlibs',
      ],
      'ldflags!': [
        # -nodefaultlibs turns -pthread into a no-op, causing an unused argument
        # warning. Explicitly link with -lpthread instead.
        '-pthread',
      ],
      'libraries': [
        '-lc',
        '-lgcc_s',
        '-lm',
        '-lpthread',
        '-lrt',
      ],
    },
  ]
}