const Job = require('../models/Job');
const Profile = require('../models/Profile');
const Application = require('../models/Application');

exports.getRecommendedJobs = async (req, res) => {
    try {
        // 1. Retrieve the candidate's profile to access their skills array
        const profile = await Profile.findOne({ user: req.user.id });

        // 2. Safety Check: If no profile or skills, return the latest jobs as a fallback
        if (!profile || !profile.skills || profile.skills.length === 0) {
            const fallbackJobs = await Job.find().sort({ createdAt: -1 }).limit(10);
            return res.status(200).json(
    fallbackJobs.map(job => ({
        ...job._doc,
        matchPercentage: 0,
        matchedSkills: []
    }))
);
        }

        const userSkills = profile.skills; // Array of strings: ["React", "Node.js", "MongoDB"]

        // 3. Query Database: Find jobs where the description contains any of the user's skills
        // We use $regex with 'i' for case-insensitive matching
        const matchingJobs = await Job.find({
            $or: userSkills.map(skill => ({
                description: { $regex: skill, $options: 'i' }
            }))
        });

        // 4. Ranking Algorithm: Calculate match percentage for each job
        const rankedJobs = matchingJobs.map(job => {
            let matchCount = 0;
            const matchedSkills = [];

            userSkills.forEach(skill => {
                // Check if the specific skill exists in the job title or description
                const inDescription = job.description.toLowerCase().includes(skill.toLowerCase());
                const inTitle = job.title.toLowerCase().includes(skill.toLowerCase());
                
                if (inDescription || inTitle) {
                    matchCount++;
                    matchedSkills.push(skill);
                }
            });

            // Calculate percentage based on user's total skills
            const matchPercentage = (matchCount / userSkills.length) * 100;

            return {
                ...job._doc,
                matchPercentage: Math.round(matchPercentage),
                matchedSkills: matchedSkills
            };
        });

        // 5. Sort: Highest percentage match at the top
        rankedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json(rankedJobs);
    } catch (err) {
        console.error("Recommendation Error:", err);
        res.status(500).json({ message: "Internal Server Error during job matching" });
    }
};
