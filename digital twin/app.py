from flask import Flask, request, render_template_string

app = Flask(__name__)

# -----------------------
# City State (in-memory)
# -----------------------
city_state = {
    "traffic": 50,
    "pollution": 50,
    "green_cover": 40,
    "population": 1000000
}

# -----------------------
# HTML Template
# -----------------------
HTML_TEMPLATE = """
<!doctype html>
<html>
<head>
    <title>🏙️ Digital Twin Simulation</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
        h1 { color: #333; }
        .stats { margin-top: 20px; font-size: 18px; }
        .btn { 
            display: inline-block; padding: 10px 20px; margin: 10px; 
            font-size: 16px; border: none; border-radius: 8px; cursor: pointer;
        }
        .flyover { background-color: #4CAF50; color: white; }
        .transport { background-color: #2196F3; color: white; }
        .population { background-color: #FF5722; color: white; }
        .park { background-color: #8BC34A; color: white; }
        .reset { background-color: #9E9E9E; color: white; }
    </style>
</head>
<body>
    <h1>🏙️ Urban Planning Digital Twin</h1>
    <p>Select an action to simulate:</p>

    <form method="post" action="/action">
        <button class="btn flyover" name="choice" value="flyover">🚧 Add Flyover</button>
        <button class="btn transport" name="choice" value="transport">🚌 Improve Public Transport</button>
        <button class="btn population" name="choice" value="population">👥 Population Growth</button>
        <button class="btn park" name="choice" value="park">🌳 Build Park</button>
        <button class="btn reset" name="choice" value="reset">🔄 Reset</button>
    </form>

    <div class="stats">
        <h2>📊 Current City/area Stats</h2>
        <p>🚦 Traffic Congestion: {{ traffic }}/100</p>
        <p>🏭 Pollution Level: {{ pollution }}/100</p>
        <p>🌱 Green Cover: {{ green_cover }}%</p>
        <p>👥 Population: {{ population }}</p>
    </div>

    {% if message %}
    <h3>{{ message }}</h3>
    {% endif %}
</body>
</html>
"""

# -----------------------
# Routes
# -----------------------
@app.route("/", methods=["GET"])
def home():
    return render_template_string(HTML_TEMPLATE, **city_state, message=None)

@app.route("/action", methods=["POST"])
def action():
    choice = request.form["choice"]
    message = ""

    if choice == "flyover":
        city_state["traffic"] = max(0, city_state["traffic"] - 15)
        message = "✅ New flyover built! Traffic reduced."
    elif choice == "transport":
        city_state["traffic"] = max(0, city_state["traffic"] - 10)
        city_state["pollution"] = max(0, city_state["pollution"] - 5)
        message = "✅ Public transport improved! Less traffic & pollution."
    elif choice == "population":
        city_state["population"] += 200000
        city_state["traffic"] = min(100, city_state["traffic"] + 10)
        city_state["pollution"] = min(100, city_state["pollution"] + 5)
        message = "⚠️ Population increased! More traffic & pollution."
    elif choice == "park":
        city_state["green_cover"] += 5
        city_state["pollution"] = max(0, city_state["pollution"] - 10)
        message = "🌳 New park added! More green cover & cleaner air."
    elif choice == "reset":
        city_state.update({"traffic": 50, "pollution": 50, "green_cover": 40, "population": 1000000})
        message = "🔄 Simulation reset to default values."
    else:
        message = "❌ Invalid choice."

    return render_template_string(HTML_TEMPLATE, **city_state, message=message)

# -----------------------
# Run
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
