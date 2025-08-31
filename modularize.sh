nx init

#domain
nx generate @nx/js:library --name=domain --directory=libs --buildable=true --publishable=false --unitTestRunner=jest --bundler=tsc --importPath=@gorenas/domain

#application
nx generate @nx/js:library --name=application-core --directory=libs/application --buildable=true --publishable=false --unitTestRunner=jest --bundler=tsc --importPath=@gorenas/application-core
nx generate @nx/angular:library --name=application-angular --directory=libs/application --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/application-angular

# Shared
nx generate @nx/js:library --name=shared-util-core --directory=libs/shared/util --buildable=true --publishable=false --unitTestRunner=jest --bundler=tsc --importPath=@gorenas/shared-util-core
nx generate @nx/angular:library --name=shared-util-forms --directory=libs/shared/util --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/shared-util-forms

# Data Access
nx generate @nx/angular:library --name=data-access-core --directory=libs/data-access --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/data-access-core
nx generate @nx/angular:library --name=data-access-features --directory=libs/data-access --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/data-access-features
nx generate @nx/angular:library --name=data-access-forms --directory=libs/data-access --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/data-access-forms
nx generate @nx/angular:library --name=data-access-commons --directory=libs/data-access --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/data-access-commons

# UI
nx generate @nx/angular:library --name=ui-commons --directory=libs/ui --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/ui-commons
nx generate @nx/angular:library --name=ui-controls --directory=libs/ui --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/ui-controls
nx generate @nx/angular:library --name=ui-forms --directory=libs/ui --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/ui-forms
nx generate @nx/angular:library --name=ui-features --directory=libs/ui --buildable=true --publishable=false --unitTestRunner=jest --routing=false --standalone=true --importPath=@gorenas/ui-features
