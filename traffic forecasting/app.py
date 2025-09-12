# app.py
from flask import Flask, render_template, request
import numpy as np

app = Flask(__name__)

# -----------------------
# 1. Environment
# -----------------------
class CityEnv:
    def __init__(self):
        self.reset()

    def reset(self):
        self.budget = 100
        self.state = np.array([50, 40, 30])  # traffic, pollution, happiness
        return self.state

    def step(self, action):
        # Apply action effects
        if action == "invest_traffic":
            self.state[0] -= 10  # reduce traffic
            self.budget -= 20
        elif action == "invest_pollution":
            self.state[1] -= 10
            self.budget -= 20
        elif action == "invest_happiness":
            self.state[2] += 10
            self.budget -= 20

        # Clamp values
        self.state = np.clip(self.state, 0, 100)

        reward = self.state[2] - self.state[0] - self.state[1]
        done = self.budget <= 0
        return self.state, reward, done


# -----------------------
# 2. Flask Routes
# -----------------------
@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    if request.method == "POST":
        traffic = int(request.form["traffic"])
        pollution = int(request.form["pollution"])
        happiness = int(request.form["happiness"])
        action = request.form["action"]

        env = CityEnv()
        env.state = np.array([traffic, pollution, happiness])
        env.budget = 100

        new_state, reward, done = env.step(action)
        result = {
            "new_state": new_state.tolist(),
            "reward": reward,
            "done": done,
            "budget": env.budget,
        }

    return render_template("index.html", result=result)


# -----------------------
# 3. Run App
# -----------------------
if __name__ == "__main__":
    app.run(debug=True, port=8070)
