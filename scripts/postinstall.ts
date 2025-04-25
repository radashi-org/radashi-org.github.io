import subrepoInstall from 'subrepo-install'

subrepoInstall([
  {
    dir: 'starlight',
    remote: 'https://github.com/radashi-org/radashi-org.github.io',
    ref: 'starlight',
    rootPackageStrategy: 'install-only',
    packages: ['packages/starlight'],
  },
])
