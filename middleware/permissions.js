const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!req.user.hasPermission(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${requiredPermission} permission required.`
      });
    }

    next();
  };
};

const checkReadPermission = checkPermission('read');
const checkWritePermission = checkPermission('write');
const checkDeletePermission = checkPermission('delete');

module.exports = {
  checkPermission,
  checkReadPermission,
  checkWritePermission,
  checkDeletePermission
}; 