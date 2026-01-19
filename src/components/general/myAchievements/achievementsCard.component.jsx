import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import styles from "./achievementsCard.module.css";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Tooltip } from "@mui/material";

const AchievementsCard = ({ achievement }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    // Open file function for SharePoint attachments
    const openFile = (attachment) => {
        // Use ServerRelativeUrl if available, otherwise use ServerRelativePath
        const serverPath = attachment.ServerRelativeUrl ||
            (attachment.ServerRelativePath?.DecodedUrl || '');

        if (!serverPath) {
            console.error('No server path found for attachment:', attachment);
            return;
        }

        // Construct the full URL
        let fullUrl;

        // Check if it's already a full URL
        if (serverPath.startsWith('http')) {
            fullUrl = serverPath;
        } else {
            // Get base URL from environment or window location
            const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

            // Use URL constructor to properly handle path joining
            try {
                fullUrl = new URL(serverPath, baseUrl).href;
            } catch (error) {
                console.error('Error constructing URL:', error);
                // Fallback to manual construction
                const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                const cleanPath = serverPath.startsWith('/') ? serverPath : `/${serverPath}`;
                fullUrl = `${cleanBaseUrl}${cleanPath}`;
            }
        }

        console.log('Opening attachment URL:', fullUrl);
        window.open(fullUrl, '_blank');
    };

    return (
        <Card className={styles.achievementCard}>
            <CardContent className={styles.cardContent}>
                {/* Trophy watermark */}
                <div className={styles.trophyBackground}></div>

                <Typography variant="h6" className={styles.achTitle} color="primary" sx={{ mb: .2, fontSize: "18px", fontWeight: 700 }}>
                    {achievement.Title}
                </Typography>
                <Typography className={styles.achDate} sx={{ fontSize: "14px" }}>
                    {formatDate(achievement.Date)}
                </Typography>
                <Tooltip
                    title={achievement.Description?.replace(/<[^>]*>?/gm, '') || ""}
                    arrow
                    placement="top"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                fontSize: "13px",
                                maxWidth: 400,
                                lineHeight: 1.6,
                                p: 1.2
                            }
                        }
                    }}
                >
                    <Typography className={styles.achDesc} sx={{ mt: 3, fontSize: "15px", fontWeight: 500 }}>
                        {achievement.Description?.replace(/<[^>]*>?/gm, '') || ""}
                    </Typography>
                </Tooltip>

                {/* Attachments section - similar to tasks */}
                <Box sx={{ mt: 4 }}>
                    {achievement.AttachmentFiles?.results?.length > 0 ? (
                        <Stack spacing={1}>
                            {achievement.AttachmentFiles.results.map((attachment, index) => (
                                <Box
                                    key={index}
                                    className={styles.attachmentItem}
                                    onClick={() => openFile(attachment)}
                                >
                                    <Box className={styles.attachmentInfo}>
                                        <UploadFileIcon className={styles.attachIcon} color="primary" sx={{ fontSize: "20px" }} />
                                        <Typography className={styles.fileName} sx={{ fontSize: "15px" }}>
                                            {attachment.FileName}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Box sx={{ opacity: 0.5, py: 1 }}>
                            No Attachment
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card >
    );
};

export default AchievementsCard;