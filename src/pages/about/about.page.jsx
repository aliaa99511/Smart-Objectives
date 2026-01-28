import React from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    Divider,
    Chip,
    Grid2,
} from "@mui/material";
import aboutFullscreen from "../../assets/about-fullscreen.svg";

const smartItems = [
    {
        letter: "S",
        title: "Specific",
        description:
            "Objectives should be clearly defined so everyone understands exactly what needs to be achieved.",
    },
    {
        letter: "M",
        title: "Measurable",
        description:
            "Each objective must include a way to track progress and determine when it has been completed.",
    },
    {
        letter: "A",
        title: "Achievable",
        description:
            "Goals should be realistic and attainable with the available time, skills, and resources.",
    },
    {
        letter: "R",
        title: "Relevant",
        description:
            "Every objective should support the goals of the team and contribute to the company’s direction.",
    },
    {
        letter: "T",
        title: "Time-Based",
        description:
            "Objectives must have a clear timeframe or deadline to create focus and accountability.",
    },
];

const About = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    position: "relative",
                    height: 220,
                    display: "flex",
                    alignItems: "end",
                    p: 4,
                    color: "#fff",
                    backgroundImage: `url("${aboutFullscreen}")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                }}
            >
                {/* Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(122, 107, 183, 0.85)",
                    }}
                />

                {/* Content */}
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="h4" fontWeight={600} fontSize={28}>
                        About SMART Objectives
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.95, mt: 1 }}>
                        Create, manage and track organizational objectives and achievements
                    </Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2 }}>
                {/* What is SMART */}
                <Box mb={4}>
                    <Typography variant="h6" fontSize={18} fontWeight={700} color="primary" mb={.5}>
                        What Is SMART Objectives?
                    </Typography>
                    <Typography fontSize={13} fontWeight={500} lineHeight={1.7}>
                        SMART objectives is the company’s internal platform for defining,
                        tracking, and evaluating goals across all levels of the organization
                        — from individual employees to executives. It creates a shared
                        understanding of what success looks like, how progress is measured,
                        and how individual contributions support the company’s strategy.
                    </Typography>
                </Box>

                {/* SMART Framework */}
                <Box>
                    <Typography variant="h6" fontSize={18} fontWeight={700} color="primary" mb={1.5}>
                        The SMART Framework
                    </Typography>

                    <Grid2 container spacing={2}>
                        {smartItems.map((item) => (
                            <Grid2 size={{ xs: 12, sm: 6 }} key={item.letter} sx={{ mb: 1.3 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 2,
                                        height: "100%",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                                        display: "flex",
                                        backgroundColor: "#f4f3f9",

                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: "100%",
                                            borderTopRightRadius: 20,
                                            borderBottomRightRadius: 20,
                                            backgroundColor: "primary.main",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            fontSize: 20,
                                        }}
                                    >
                                        {item.letter}
                                    </Box>
                                    <CardContent
                                        sx={{
                                            p: 1.3,
                                            pl: 2.1,
                                            pb: 1.4,
                                            "&:last-child": {
                                                pb: 1.4,
                                            },
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Box>
                                                <Typography fontWeight={600}>
                                                    {item.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    mt={0.5}
                                                >
                                                    {item.description}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
            </Box>

            <Divider />

            {/* Footer */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "text.secondary",
                    backgroundColor: "#fff",
                }}
            >
                <Typography variant="caption">
                    System Version:
                    <Chip label="1.0.0" size="small" sx={{ ml: .5, color: "#1E88D7", background: "#41A5EE30" }} />
                </Typography>
                <Typography variant="caption">
                    © 2026 target Integrated Systems. All rights reserved.
                </Typography>
                <Typography variant="caption">Last Updated: 8/1/2026</Typography>
            </Box>
        </Box>
    );
};

export default About;
