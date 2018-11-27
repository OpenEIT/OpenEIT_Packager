# OpenEIT Dashboard
-----------------

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
Now, run the pyinstaller to make a self-contained python package. 

```
pyinstaller eit_dash/app.py --distpath pydistribution --debug --log-level TRACE

```

Add this to the top of app.spec if you get a recurstion depth error then try pyinstaller again:

```
import sys
sys.setrecursionlimit(5000)
```

then re-run the pyinstaller to get a single package:

```

pyinstaller app.spec --onefile --distpath pydistribution --debug --log-level TRACE
```

Now clean up the folders you don't need: 

```
rm -rf build/
rm -rf app.spec

```


There should be a folder called pydistribution which contains the final packaged python app! If not, there is an error which needs to be fixed before continuing. 

# Final packaging it all together: 
Now package the front end and backend together by running: 

```
electron-packager . --icon=icons/macos.icns --platform=darwin --arch=x64 --overwrite --prune=true
```

There should be a package contained in "OpenEIT-darwin-x64" which can be distributed and moved from machine to machine. 


## ----

Visualization dashboard for OpenEIT.

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

> Note: If you new mode requires some special settings for the board, we recommend that you add this logic in the `state.State` class, inside the `set_mode()` method.