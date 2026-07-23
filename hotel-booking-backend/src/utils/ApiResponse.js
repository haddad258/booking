class ApiResponse {
  static send(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
    const body = {
      success: true,
      message,
    };
    if (data !== null) body.data = data;
    if (meta !== null) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  static paginated(res, { data, page, limit, total, message = 'Success' }) {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  }
}

module.exports = ApiResponse;
