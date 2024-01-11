const Banner = require('../models/bannerModel')

//GER LIST OF ALL BANNERS
const bannerList = async (req, res) => {
    try {
        const bannerData = await Banner.find();
        res.json({ status: 'success', data: bannerData });
    } catch (error) {
        console.log(error.message);
        res.json({ status: 'error', message: 'An error occurred' });
    }
}
//FOR UPLOAD BANNER INTO DATABASE
const uploadBanner = async (req, res) => {
    try {
        const { heading, subHeading, buttonText, buttonLink, status } = req.body
        const banner = new Banner({
            heading: heading,
            subHeading: subHeading,
            buttonText: buttonText,
            buttonLink: buttonLink,
            status: status,
            image: req.file.filename
        })
        await banner.save()
        res.json({ status: 'success', message: 'Banner uploaded successfully' });
    } catch (error) {
        console.log(error.message)
        res.json({ status: 'error', message: 'An error occurred' });
    }
}

//UPDATE BANNER
const updateBanner = async (req, res) => {
    try {
        const { heading, subHeading, buttonText, buttonLink, status, id } = req.body
        await Banner.updateOne({ _id: id }, {
            $set: {
                heading: heading,
                subHeading: subHeading,
                buttonText: buttonText,
                buttonLink: buttonLink,
                status: status,
            }
        })
        if (req.file) {
            await Banner.updateOne({ _id: id }, {
                $set: {
                    image: req.file.filename
                }
            })
        }
        res.json({ message: 'Banner updated successfully' })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' })
    }
}

//DELETE BANNER
const deleteBanner = async (req, res) => {
    try {
        const id = req.body.id
        await Banner.deleteOne({ _id: id })
        res.json({ response: true, message: 'Banner deleted successfully' })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ response: false, error: 'Server error' })
    }
}

module.exports = {
    bannerList,
    uploadBanner,
    updateBanner,
    deleteBanner,
}