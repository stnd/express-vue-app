const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
};

const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRoles = req.user.Roles.map((role) => role.name);
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userPermissions = req.user.Roles.reduce((perms, role) => {
      return [...perms, ...(role.permissions || [])];
    }, []);

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: "Permission denied" });
    }

    next();
  };
};

export { isAuthenticated, hasRole, hasPermission };
