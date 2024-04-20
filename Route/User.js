const router = require("express").Router ()

const User = require('../Models/UserModel')

router.post('/createuser', async (req, res) => {  
    try {
        // Extract user details from the request body
        const { userid, username, mobilenumber, lastbook } = req.body;

        // Check if the user ID or mobile number already exists
        const existingUser = await User.findOne({ $or: [{ userid }, { mobilenumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User ID or mobile number already exists' });
        }

        // Create a new user using the User model
        const newUser = new User({
            userid: userid,
            username: username,   
            mobilenumber: mobilenumber,
            lastbook: lastbook
        });

        // Save the new user to the database
        await newUser.save();
        const userlist = await User.find()

        // Respond with a success message
        res.status(201).json({ message: 'User created successfully', userlist});
    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

router.get('/getusers',async(req,res) => {
    try {
        const users = await User.find();
            res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to find all user' });
    }
})

// Delete user

router.delete('/deleteusers', async (req, res) => {
    try {
        const { userid } = req.body; // Use req.body instead of req.body()
        const user = await User.findOne({ userid });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.lastbook && user.lastbook.bookname) { // Check if lastbook exists
            return res.status(400).json({ message: 'User already has a book' });
        }

        await User.deleteOne({ userid }); // Corrected method name to deleteOne
        // No need to call User.save() after deletion

        const updateduserlist = await User.find()

        res.status(200).json({ message: `${user.username} has been successfully deleted`, updateduserlist });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

//get overdue users
router.get('/getoverduesubscribers', async (req, res) => {
    try {
        // Get today's date
        const today = new Date();
        // Find users whose subscriptions are overdue based on duedate and isoverdue fields
        const overdueUsers = await User.find({
            'lastbook.duedate': { $lt: today }, // Due date is before today
             // Subscription is marked as overdue
        });
        res.status(200).json(overdueUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get overdue subscribers' });
    }
});



module.exports = router