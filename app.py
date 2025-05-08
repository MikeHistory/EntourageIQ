from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load data from CSV
df = pd.read_csv('products.csv')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    payload = request.json or {}
    terps    = payload.get('terpenes', [])      # list of terpene strings
    lineage  = payload.get('lineage', [])       # list of lineage strings
    weights  = payload.get('weights', [])       # list of weight strings

    df_filtered = df.copy()

    # --- terpene filter: row must contain *all* selected terpenes (case‑insensitive) ---
    for t in terps:
        df_filtered = df_filtered[df_filtered['Terpenes']
                                  .str.lower().str.contains(t.lower())]

    # --- lineage filter ---
    if lineage:
        df_filtered = df_filtered[df_filtered['Lineage'].isin(lineage)]

    # --- weight filter ---
    if weights:
        df_filtered = df_filtered[df_filtered['Weight'].isin(weights)]

    return jsonify(df_filtered.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load data from CSV
df = pd.read_csv('products.csv')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    terps = request.json.get('terpenes', [])
    df_filtered = df.copy()
    for t in terps:
        df_filtered = df_filtered[df_filtered['Terpenes'].str.lower().str.contains(t)]
    return jsonify(df_filtered.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
