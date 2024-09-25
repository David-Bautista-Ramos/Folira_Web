import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		const notifications = await Notification.find({ para: userId }).populate({
			path: "de",
			select: "nombre fotoPerfil",
		});

		await Notification.updateMany({ para: userId }, { read: true });

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		await Notification.deleteMany({ para: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deteteNotification = async(req ,res) => {
    try {
        const notificationId = req.body.id;
        const userId = req.user._id;
        const notification = await Notification.findById(notificationId)

        if(!notification){
            res.status(404).json({error: "Notificacion no encontrada"});
        }

        if(notification.para.toString() !== userId.toString()){
            res.status(403).json({error: "tu no puedes eliminar esta notificacion"});
        }

        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({message: "Notificacion eliminada con exito"});
    } catch (error) {
        console.log("Error in deteteNotification function", error.message);
        res.status(500).json({error: "Internal server Error"});
    }
};