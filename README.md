# The Echo project
Taking notes is now history

## How to run the project backend
1- Make sure you have Ollama by installed by downloading the exe file from https://ollama.com/ also you should have python and pip installed.

2- Install the model you want by running the following command on terminal: ollama run (model number)

3- Now head to the project files and run the following command to install the dependencies: pip install -r requirements.txt

4- Next create a .env file in the root directory with the following variable: model=(model number) model=llama3.1

5- Then run: python app.py

You can find the model numbers here: https://ollama.com/search

## How to run the project frontend
1- Run: cd frontend

2- Make sure you have node installed

3- Run the following command to install the dependencies: npm install

4- Then run: npm start