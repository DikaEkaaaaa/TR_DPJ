from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_URL = "http://192.168.157.130/rest/interface/bridge"
AUTH = ('admin', 'admin123')

def fetch_bridges():
    try:
        response = requests.get(API_URL, auth=AUTH)
        if response.status_code == 200:
            return response.json()
        else:
            return []  
    except Exception as e:
        print("Error fetching bridges:", e)
        return []


@app.route('/')
def index():
    bridges = fetch_bridges()  
    return render_template('index.html', bridges=bridges)  


@app.route('/bridge/<id>')
def bridge_detail(id):
    try:
        response = requests.get(f"{API_URL}/{id}", auth=AUTH)
        if response.status_code == 200:
            return jsonify(response.json())  
        else:
            return jsonify({})  
    except Exception as e:
        print(f"Error fetching bridge {id} details:", e)
        return jsonify({})  


@app.route('/add', methods=['POST'])
def add_bridge():
    try:
        data = request.json  
        print("Data received:", data)  
        response = requests.put(API_URL, auth=AUTH, json={
            "name": data["name"],
            "arp": data["arp"],
            "protocol-mode": data["protocol-mode"],
            "vlan-filtering": data["vlan-filtering"]
        })
        if response.status_code == 201:
            return jsonify({"message": "Bridge created successfully"}), 201  
        print("Error from API:", response.text)  
        return jsonify({"error": "Failed to create bridge"}), response.status_code  
    except Exception as e:
        print("Exception occurred:", e)  
        return jsonify({"error": "An error occurred"}), 500  


@app.route('/delete/<bridge_id>', methods=['DELETE'])
def delete_bridge(bridge_id):
    response = requests.delete(f"{API_URL}/{bridge_id}", auth=AUTH)
    if response.status_code == 204:
        return jsonify({"message": "Bridge deleted successfully"}), 204
    return jsonify({"error": "Failed to delete bridge"}), response.status_code



@app.route('/update/<bridge_id>', methods=['PUT'])
def update_bridge(bridge_id):
    try:
        data = request.json  
        response = requests.patch(f"{API_URL}/{bridge_id}", auth=AUTH, json=data)
        if response.status_code == 200:
            return jsonify({"message": "Bridge updated successfully"}), 200  
        else:
            return jsonify({"error": "Failed to update bridge"}), 400  
    except Exception as e:
        print(f"Error updating bridge {bridge_id}:", e)
        return jsonify({"error": "An error occurred"}), 500  


if __name__ == '__main__':
    app.run(debug=True)
