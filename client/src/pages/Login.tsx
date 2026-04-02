import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Link,
  Flex,
  Grid,
  GridItem,
  Separator,
  Field,
} from "@chakra-ui/react";

const DiamondMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 8L8 2L14 8L8 14L2 8Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" fill="#C9A84C"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const showToast = (title: string, description: string) => {
    alert(`${title}: ${description}`);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Missing fields", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        // Store JWT token in localStorage
        localStorage.setItem("token", data.token);
        // Small delay to ensure state is updated
        setTimeout(() => navigate("/app"), 100);
      } else {
        showToast("Login failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@300;400;500&display=swap');
        body { margin: 0; }

        .left-panel {
          background: #0d0c0a;
          position: relative;
          overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 15% 85%, rgba(201,168,76,0.13) 0%, transparent 55%),
            radial-gradient(ellipse 50% 35% at 85% 15%, rgba(201,168,76,0.07) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px);
          background-size: 56px 56px;
          z-index: 0;
        }
        .left-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
        }
        .display-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 3.8vw, 56px);
          line-height: 1.12;
          color: #f2ede4;
          font-weight: 400;
          margin: 0;
        }
        .display-heading em {
          font-style: italic;
          color: #c9a84c;
        }
        .form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 500;
          color: #1c1a16;
          line-height: 1.1;
          margin: 0;
        }
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .fade-up.in {
          opacity: 1;
          transform: translateY(0);
        }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          color: #c9a84c;
          line-height: 1;
          font-weight: 400;
        }
        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-family: 'Outfit', sans-serif;
        }
      `}</style>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        minH="100vh"
        fontFamily="'Outfit', sans-serif"
      >
        {/* ── LEFT PANEL ── */}
        <GridItem className="left-panel" display={{ base: "none", md: "block" }}>
          <div className="grid-bg" />
          <div className="left-inner">
            {/* Brand */}
            <Flex align="center" gap="10px">
              <Flex
                w="32px" h="32px"
                border="1.5px solid rgba(201,168,76,0.55)"
                borderRadius="8px"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <DiamondMark />
              </Flex>
              <Text
                fontFamily="'Outfit', sans-serif"
                fontSize="15px"
                fontWeight="500"
                color="rgba(255,255,255,0.88)"
                letterSpacing="0.02em"
              >
                
              </Text>
            </Flex>

            {/* Hero copy */}
            <Box>
              <h2 className="display-heading">
                Where ideas<br />become <em>reality.</em>
              </h2>
              <Text
                mt="18px"
                fontSize="15px"
                color="rgba(255,255,255,0.38)"
                lineHeight="1.75"
                fontWeight="300"
                maxW="300px"
                fontFamily="'Outfit', sans-serif"
              >
                A focused workspace for teams that ship fast and think clearly.
              </Text>

              {/* Stats */}
              <Box mt="44px" pt="36px" borderTop="1px solid rgba(255,255,255,0.07)">
                <Flex gap="40px">
                  {[
                    { num: "12k+", label: "Teams" },
                    { num: "99.9%", label: "Uptime" },
                    { num: "4.9★", label: "Rating" },
                  ].map((s) => (
                    <Box key={s.label}>
                      <div className="stat-num">{s.num}</div>
                      <div className="stat-label">{s.label}</div>
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Box>
          </div>
        </GridItem>

        {/* ── RIGHT PANEL ── */}
        <GridItem
          bg="#f7f4ef"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={{ base: "24px", md: "56px" }}
          py="48px"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0,
            h: "3px",
            background: "linear-gradient(90deg, #c9a84c, #e8c96e, #c9a84c)",
          }}
        >
          <Box w="100%" maxW="380px" className={`fade-up ${visible ? "in" : ""}`}>

            {/* Eyebrow + heading */}
            <Text
              fontSize="11px"
              fontWeight="500"
              letterSpacing="0.12em"
              textTransform="uppercase"
              color="#c9a84c"
              mb="10px"
              fontFamily="'Outfit', sans-serif"
            >
              Welcome back
            </Text>
            <h1 className="form-heading">Sign in</h1>
            <Text
              mt="8px"
              mb="36px"
              fontSize="14px"
              color="#8a867e"
              fontWeight="300"
              fontFamily="'Outfit', sans-serif"
            >
              Enter your credentials to continue
            </Text>

            <Stack gap="4">
              {/* Email field */}
              <Field.Root>
                <Field.Label
                  fontSize="11px"
                  fontWeight="500"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color="#5a5650"
                  mb="1"
                  fontFamily="'Outfit', sans-serif"
                >
                  Email
                </Field.Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  autoComplete="email"
                  h="48px"
                  bg="white"
                  border="1.5px solid"
                  borderColor="#ddd8ce"
                  borderRadius="10px"
                  fontFamily="'Outfit', sans-serif"
                  fontSize="15px"
                  color="#1c1a16"
                  px="4"
                  _placeholder={{ color: "#b5b0a6" }}
                  _focus={{
                    borderColor: "#c9a84c",
                    boxShadow: "0 0 0 3px rgba(201,168,76,0.14)",
                    outline: "none",
                  }}
                  _hover={{ borderColor: "#c9a84c" }}
                />
              </Field.Root>

              {/* Password field */}
              <Field.Root>
                <Flex justify="space-between" align="center" mb="1">
                  <Field.Label
                    fontSize="11px"
                    fontWeight="500"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color="#5a5650"
                    mb="0"
                    fontFamily="'Outfit', sans-serif"
                  >
                    Password 
                  </Field.Label>
                  <Link
                    href="/forgot-password"
                    fontSize="12px"
                    color="#8a867e"
                    fontFamily="'Outfit', sans-serif"
                    textDecoration="none"
                    _hover={{ color: "#c9a84c" }}
                  >
                     Forgot password?
                  </Link>
                </Flex>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  autoComplete="current-password"
                  h="48px"
                  bg="white"
                  border="1.5px solid"
                  borderColor="#ddd8ce"
                  borderRadius="10px"
                  fontFamily="'Outfit', sans-serif"
                  fontSize="15px"
                  color="#1c1a16"
                  px="4"
                  _placeholder={{ color: "#b5b0a6" }}
                  _focus={{
                    borderColor: "#c9a84c",
                    boxShadow: "0 0 0 3px rgba(201,168,76,0.14)",
                    outline: "none",
                  }}
                  _hover={{ borderColor: "#c9a84c" }}
                />
              </Field.Root>
            </Stack>

            {/* Sign in button */}
            <Button
              width="full"
              mt="6"
              h="50px"
              bg="#2563eb"
              color="#ffffff"
              borderRadius="10px"
              fontFamily="'Outfit', sans-serif"
              fontSize="15px"
              fontWeight="500"
              letterSpacing="0.03em"
              border="none"
              onClick={handleLogin}
              loading={loading}
              loadingText="Signing in…"
              position="relative"
              overflow="hidden"
              _hover={{ bg: "#1d4ed8", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              _after={{
                content: '""',
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent 55%)",
                pointerEvents: "none",
              }}
            >
              Sign in
            </Button>

            {/* Divider */}
            <Flex align="center" gap="3" my="6">
              <Separator flex="1" borderColor="#ddd8ce" />
              <Text
                fontSize="11px"
                color="#b5b0a6"
                letterSpacing="0.06em"
                textTransform="uppercase"
                fontFamily="'Outfit', sans-serif"
              >
                or
              </Text>
              <Separator flex="1" borderColor="#ddd8ce" />
            </Flex>

            {/* Sign up */}
            <Text
              mt="8"
              textAlign="center"
              fontSize="13px"
              color="#8a867e"
              fontFamily="'Outfit', sans-serif"
            >
              Don't have an account?{" "}
              <Link
                href="/signup"
                color="#1c1a16"
                fontWeight="500"
                borderBottom="1px solid #c9a84c"
                pb="1px"
                textDecoration="none"
                _hover={{ color: "#c9a84c" }}
              >
                Create one
              </Link>
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}
