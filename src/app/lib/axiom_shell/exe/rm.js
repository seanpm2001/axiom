
// Copyright (c) 2014 The Axiom Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import AxiomError from 'axiom/core/error';
import Path from 'axiom/fs/path';

import environment from 'axiom_shell/environment';
import util from 'axiom_shell/util';

export var main = function(executeContext) {
  executeContext.ready();

  var arg = executeContext.arg;
  if (!arg._ && arg._.length)
    return Promise.reject(new AxiomError.Missing('path'));

  var fileSystem = environment.getServiceBinding('filesystems@axiom');

  var rmNext = function() {
    if (!arg._.length)
      return Promise.resolve(null);

    var pathSpec = arg._.shift();
    pathSpec = Path.abs(executeContext.getEnv('$PWD', '/'), pathSpec);

    return fileSystem.unlink(pathSpec).then(
        function() {
      return rmNext();
    }).catch(function(e) {
      executeContext.stdout(e);
      //TODO(grv): handle error here.
      return rmNext();
    });
  };

  return rmNext();
};

export default main;

main.argSigil = '%';
