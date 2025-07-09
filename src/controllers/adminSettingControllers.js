const AdminSetting = require('../models/admin.setting.model');

exports.usdToInr = async (req, res, next) => {
    try {
        const { InrValue, logoutTime } = req.body;

        if (!InrValue || typeof InrValue !== 'number') {
            return res.status(400).json({ message: 'InrValue is required and must be a number.' });
        }

        const existingSetting = await AdminSetting.findOne({});

        if (existingSetting) {
            const noInrChange = existingSetting.InrValue === InrValue;
            const noLogoutChange = typeof logoutTime !== 'number' || existingSetting.logoutTime === logoutTime;

            if (noInrChange && noLogoutChange) {
                return res.status(200).json({
                    message: 'No update needed. Values are already up to date.',
                    data: existingSetting
                });
            }

            // Update only changed fields
            existingSetting.InrValue = InrValue;

            if (typeof logoutTime === 'number' && logoutTime >= 1) {
                existingSetting.logoutTime = logoutTime;
            }

            await existingSetting.save();

            return res.status(200).json({
                message: 'Admin setting updated successfully.',
                data: existingSetting
            });
        } else {
            // Create new document
            const payload = { InrValue };

            if (typeof logoutTime === 'number' && logoutTime >= 1) {
                payload.logoutTime = logoutTime;
            }

            const newSetting = await AdminSetting.create(payload);

            return res.status(201).json({
                message: 'Admin setting created successfully.',
                data: newSetting
            });
        }

    } catch (error) {
        next(error);
    }
};


exports.updateGstSettings = async (req, res, next) => {
    try {
        const { intra_state_tax, inter_state_tax, International_tax } = req.body;

        // Validate input
        if (!intra_state_tax || !inter_state_tax || !International_tax) {
            return res.status(400).json({ message: 'Both intra state tax and inter state tax settings are required' });
        }

        // Find and update settings
        let settings = await AdminSetting.findOne({});

        if (!settings) {
            // If no settings exist, create new one
            settings = new AdminSetting({
                gstSettings: { intra_state_tax, inter_state_tax, International_tax }
            });
        } else {
            // Update existing settings
            settings.gstSettings = { intra_state_tax, inter_state_tax, International_tax };
        }

        await settings.save();


        return res.status(200).json({
            message: 'GST settings updated successfully',
            data: settings.gstSettings
        });
    } catch (error) {
        next(error);
    }
};