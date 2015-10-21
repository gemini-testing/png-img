# Copyright 2015 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.
{
  'targets': [
    {
      'target_name': 'libc++abi',
      'type': 'static_library',
      'toolsets': ['host', 'target'],
      'dependencies=': [],
      'sources': [
        './libcxxabi/src/abort_message.cpp',
        './libcxxabi/src/cxa_aux_runtime.cpp',
        './libcxxabi/src/cxa_default_handlers.cpp',
        './libcxxabi/src/cxa_demangle.cpp',
        './libcxxabi/src/cxa_exception.cpp',
        './libcxxabi/src/cxa_exception_storage.cpp',
        './libcxxabi/src/cxa_guard.cpp',
        './libcxxabi/src/cxa_handlers.cpp',
        './libcxxabi/src/cxa_new_delete.cpp',
        './libcxxabi/src/cxa_personality.cpp',
        './libcxxabi/src/cxa_unexpected.cpp',
        './libcxxabi/src/cxa_vector.cpp',
        './libcxxabi/src/cxa_virtual.cpp',
        './libcxxabi/src/exception.cpp',
        './libcxxabi/src/private_typeinfo.cpp',
        './libcxxabi/src/stdexcept.cpp',
        './libcxxabi/src/typeinfo.cpp',
      ],
      'include_dirs': [
        './libcxxabi/include',
        '../libc++/libcxx/include'
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
    },
  ]
}