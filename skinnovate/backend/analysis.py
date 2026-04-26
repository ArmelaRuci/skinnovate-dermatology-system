"""Standardized JSON response helpers."""

from flask import jsonify


def success(data=None, message="Success", status=200):
    body = {"success": True, "message": message}
    if data is not None:
        body["data"] = data
    return jsonify(body), status


def error(message="An error occurred", status=400, details=None):
    body = {"success": False, "error": message}
    if details:
        body["details"] = details
    return jsonify(body), status


def paginated(items, total, page, per_page):
    return jsonify({
        "success": True,
        "data":     items,
        "meta": {
            "total":    total,
            "page":     page,
            "per_page": per_page,
            "pages":    (total + per_page - 1) // per_page,
        },
    }), 200
