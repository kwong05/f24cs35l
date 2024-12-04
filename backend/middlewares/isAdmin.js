function isAdmin(req, res, next) {
    const userId = req.user.id;
    console.log('Checking admin credentials');
    if (userId !== process.env.ADMIN_ID) {
        return res.status(400).json({ message: 'User not admin' });
    }
    next();
}

module.exports = isAdmin;