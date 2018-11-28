# OpenEIT Dashboard as a Portable Application
------------------------------------------

The openeit dashboard can be run through the OpenEIT repository by installing the python dependencies, but this requires some effort. To make it easy to get started, this portable python application is a desktop app with a simple DMG installer. This means users can simply double click to install a fully working time series/spectroscopy and EIT reconstruction tool kit. 

Right now, we have a DMG for OSX. If this becomes more popular and there are requests, we may consider doing it for other operating systems. 


## Run the npm installation: 

```
npm install

```

On Linux / OS X clean caches, very important!!!!!

```
rm -rf ~/.node-gyp
rm -rf ~/.electron-gyp
rm -rf ./node_modules
```

```
# On Window PowerShell (not cmd.exe!!!)
# clean caches, very important!!!!!
Remove-Item "$($env:USERPROFILE)\.node-gyp" -Force -Recurse -ErrorAction Ignore
Remove-Item "$($env:USERPROFILE)\.electron-gyp" -Force -Recurse -ErrorAction Ignore
Remove-Item .\node_modules -Force -Recurse -ErrorAction Ignore
```

Then to see if the electron app can run type the following from the root directory. The electron app should start. In this case it would be running from the unpackaged python, and is not yet packaged. 


```
./node_modules/.bin/electron .
```

## Package the python app: 

Create a  virtual environment then cd into the bin directory and activate it. 
i.e. 
```
python -m venv virty
source activate
```

Install the right things in the virtual environment: 

```
pip install -r "eit_dash/requirements.txt"

```

There should be a folder called pydistribution which contains the final packaged python app. This is a portable version of python with all module dependencies installed. It's large! 

# Final packaging it all together: 
Now package it into an app by running: 

```
electron-packager . --icon=icons/logo.icns --platform=darwin --arch=x64 --overwrite --prune=true

```

There should be a package contained in "OpenEIT-darwin-x64" which can be distributed and moved from machine to machine. 

For extra points, create the installer. First you need to install it: 

This article is helpful: https://www.electron.build/cli
https://www.npmjs.com/package/electron-builder

```

sudo npm config set unsafe-perm=true

./node_modules/.bin/electron-builder --x64 --prepackaged OpenEIT-darwin-x64 dist
```
or: 

```
./node_modules/.bin/build --prepackaged --projectDir  dist
DEBUG=electron-builder

./node_modules/.bin/electron-builder --x64 --prepackaged 

```

Now there should be a dmg contained in the dist folder, that can be installed on any machine. 


# Note on editing Visualization dashboard for OpenEIT: 

## Requirements
```
Python 3.6.1+
```

## Install
```
pip -r requirements.txt
```

## Run
```
python run.py
```

## How to add more visualizations
> Note: Visualization types are called `modes`. Each mode visualization lives in `dashboard/components/modes`.

To add your own mode visualization:
* Create a new file in `dashboard/components/modes`, for example `my_mode.py`.
* Create a new [`Dash layout`](https://dash.plot.ly/getting-started). Example:
```python
# dashboard/components/modes/my_mode.py

import dash_html_components as html

layout = html.Div([html.H3('Hello, world!')])
```
* Edit `dashboard/components/modes/__init__.py` and add information about the new mode. Example:
```python
# dashboard/components/modes/__init__.py

...
from components.modes import my_mode

modes = [
    Mode(name='Time Series', layout=time_series.layout),
    Mode(name='Bioimpedance', layout=bioimpedance.layout),
    Mode(name='Spectroscopy', layout=spectroscopy.layout),
    Mode(name='Imaging', layout=imaging.layout),

    # Add your new mode info here
    Mode(name='My Mode', layout=my_mode.layout)
]
```
* That's it! Run the app and your new mode viz should appear in the dashboard, under its own navigation tab.

