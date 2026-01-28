import { Card, CardContent, Typography, Box, Stack, Tooltip } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import cupImg from "../../../assets/cup.svg";


const AchievementsCard = ({ achievement }) => {

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const openFile = (attachment) => {
        const serverPath =
            attachment.ServerRelativeUrl ||
            attachment.ServerRelativePath?.DecodedUrl ||
            "";

        if (!serverPath) return;

        let fullUrl;

        if (serverPath.startsWith("http")) {
            fullUrl = serverPath;
        } else {
            const baseUrl =
                import.meta.env.VITE_BASE_URL || window.location.origin;

            try {
                fullUrl = new URL(serverPath, baseUrl).href;
            } catch {
                const cleanBaseUrl = baseUrl.endsWith("/")
                    ? baseUrl.slice(0, -1)
                    : baseUrl;

                const cleanPath = serverPath.startsWith("/")
                    ? serverPath
                    : `/${serverPath}`;

                fullUrl = `${cleanBaseUrl}${cleanPath}`;
            }
        }

        window.open(fullUrl, "_blank");
    };

    return (
        <Card
            sx={{
                background: "white",
                border: "1.5px solid #E8E9EB",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(232, 233, 235, 0.8)",
                transition: "all 0.2s ease",
                flex: 1,
            }}
        >
            {/* ✅ CUP OVERLAY */}
            <Box
                sx={{
                    position: "absolute",
                    right: "-16px",
                    top: 12,
                    width: "184px",
                    height: "163px",
                    opacity: .9,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                <img
                    src={cupImg}
                    alt="cup"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>

            <CardContent
                sx={{
                    p: 3,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    zIndex: 1,
                }}
            >
                <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mb: 0.2, fontSize: "18px", fontWeight: 700 }}
                >
                    {achievement.Title}
                </Typography>

                <Typography sx={{ fontSize: "14px", color: "#64748b" }}>
                    {formatDate(achievement.Date)}
                </Typography>

                <Tooltip
                    title={achievement.Description?.replace(/<[^>]*>?/gm, "") || ""}
                    arrow
                    placement="top"
                    componentsProps={{
                        tooltip: {
                            sx: { fontSize: "13px", maxWidth: 400, lineHeight: 1.6, p: 1.2 },
                        },
                    }}
                >
                    <Typography
                        sx={{
                            mt: 3,
                            fontSize: "15px",
                            fontWeight: 500,
                            color: "#272727",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            wordWrap: "break-word",
                        }}
                    >
                        {achievement.Description?.replace(/<[^>]*>?/gm, "") || ""}
                    </Typography>
                </Tooltip>

                {/* Attachments */}
                <Box sx={{ mt: 4 }}>
                    {achievement.AttachmentFiles?.results?.length > 0 ? (
                        <Stack spacing={1}>
                            {achievement.AttachmentFiles.results.map(
                                (attachment, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => openFile(attachment)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderRadius: "10px",
                                            px: "15px",
                                            py: "7px",
                                            width: "fit-content",
                                            background: "#e4e7e961",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",

                                            "&:hover": {
                                                background: "#f8fafc",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            <UploadFileIcon
                                                color="primary"
                                                sx={{ fontSize: "20px" }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: "15px",
                                                    color: "#272727",
                                                    maxWidth: "220px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {attachment.FileName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )
                            )}
                        </Stack>
                    ) : (
                        <Box sx={{ opacity: 0.5, py: 1 }}>
                            No Attachment
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default AchievementsCard;
