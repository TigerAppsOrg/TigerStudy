# TigerStudy

# Running locally

## Initial setup

1. Create a new conda environment: `conda create -n tigerstudy`
1. Activate the conda environment: `conda activate tigerstudy`
1. Install python: `conda install python=3.10`
1. Clone this repo and `cd` into the base TigerStudy directory
1. Install dependencies: `pip install -r requirements.txt`
   - If you're running into a `psycopg2` error (`pg_config executable not found`), you probably have to install `postgresql`: https://stackoverflow.com/a/24645416
1. Run `conda list` to validate that all packages in `requirements.txt` were installed.
1. Set all environment variables:
   - Login to Heroku and go to the Settings tab for the `tiger-study` app
   - Reveal Config Vars
   - For each Config Var key-value pair, create a local environment variable: `conda env config vars set key=value` (replace `key` and `value` with the actual key and value)
   - For each env var you set, reactivate your conda environment: `conda activate tigerstudy`
1. Run `conda env config vars list` to validate all env vars were set.

## Running the dev server

After following the initial setup steps above, you can run the local development server:

1. `cd` into the main directory
1. Activate your environment: `conda activate tigerstudy`
1. In `app.py`, set the `LOCAL`, `TESTING`, and `LOGIN_DISABLED` constants to `True`.
1. Run the server: `export FLASK_DEBUG=1 && flask run`
   - Visit `http://localhost:5000/` to verify the server is up and running.
   - In debug mode, the server auto-restarts when changes are made to its code.
