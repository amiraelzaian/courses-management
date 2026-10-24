export const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
//# sourceMappingURL=errorHandler.js.map