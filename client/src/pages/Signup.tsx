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

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="6.5" fill="#c9a84c" fillOpacity="0.15"/>
    <path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const perks = [
  "Free forever on the starter plan",
  "No credit card required",
  "Set up in under 2 minutes",
  "Cancel or upgrade anytime",
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 6 characters", pass: password.length >= 6 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One number", pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["#e0dbd2", "#e05c5c", "#e8a030", "#4caf50"];
  const labels = ["", "Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <Box mt="2">
      <Flex gap="4px" mb="1">
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            flex="1"
            h="3px"
            borderRadius="2px"
            bg={i < score ? colors[score] : "#e0dbd2"}
            transition="background 0.3s"
          />
        ))}
      </Flex>
      <Text fontSize="11px" color={colors[score]} fontFamily="'Outfit', sans-serif" fontWeight="500">
        {labels[score]}
      </Text>
    </Box>
  );
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      showToast("Missing fields", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Password mismatch", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      showToast("Password too short", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Account created", "Redirecting to login…");
        setTimeout(() => navigate("/"), 1500);
      } else {
        showToast("Signup failed", data.message || "Something went wrong");
      }
    } catch {
      showToast("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
          font-size: clamp(36px, 3.6vw, 52px);
          line-height: 1.13;
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
          font-size: 38px;
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
        .perk-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }
        .perk-row:first-child { border-top: 1px solid rgba(255,255,255,0.055); }
        .perk-text {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          font-weight: 300;
        }
        .perk-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
                Start building<br />something <em>great.</em>
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
                Join thousands of teams already using Axiom to move faster and think deeper.
              </Text>

              {/* Perks list */}
              <Box mt="40px">
                {perks.map((perk) => (
                  <div className="perk-row" key={perk}>
                    <div className="perk-icon">
                      <CheckIcon />
                    </div>
                    <span className="perk-text">{perk}</span>
                  </div>
                ))}
              </Box>
            </Box>

            {/* Social proof */}
            <Box>
              <Flex align="center" gap="3" mb="2">
                {/* Avatar stack */}
                <Flex>
                  {["#4a7c59", "#5b6fa0", "#a0564a", "#7c6aa0"].map((bg, i) => (
                    <Box
                      key={i}
                      w="28px" h="28px"
                      borderRadius="50%"
                      bg={bg}
                      border="2px solid #0d0c0a"
                      ml={i === 0 ? 0 : "-8px"}
                    />
                  ))}
                </Flex>
                <Text fontSize="13px" color="rgba(255,255,255,0.35)" fontFamily="'Outfit', sans-serif" fontWeight="300">
                  Joined by <Text as="span" color="rgba(255,255,255,0.65)" fontWeight="400">12,000+ teams</Text> worldwide
                </Text>
              </Flex>
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
              Get started free
            </Text>
            <h1 className="form-heading">Create account</h1>
            <Text
              mt="8px"
              mb="32px"
              fontSize="14px"
              color="#8a867e"
              fontWeight="300"
              fontFamily="'Outfit', sans-serif"
            >
              No credit card needed — up and running in minutes
            </Text>


            {/* Divider */}
            <Flex align="center" gap="3" mb="5">
              <Separator flex="1" borderColor="#ddd8ce" />
              <Text
                fontSize="11px"
                color="#b5b0a6"
                letterSpacing="0.06em"
                textTransform="uppercase"
                fontFamily="'Outfit', sans-serif"
              >
                or with email
              </Text>
              <Separator flex="1" borderColor="#ddd8ce" />
            </Flex>

            <Stack gap="4">
              {/* Email */}
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
                  Email address
                </Field.Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              {/* Password */}
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
                  Password
                </Field.Label>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
                <PasswordStrength password={password} />
              </Field.Root>

              {/* Confirm password */}
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
                  Confirm password
                </Field.Label>
                <Input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  autoComplete="new-password"
                  h="48px"
                  bg="white"
                  border="1.5px solid"
                  borderColor={
                    passwordMatch ? "#4caf50"
                    : passwordMismatch ? "#e05c5c"
                    : "#ddd8ce"
                  }
                  borderRadius="10px"
                  fontFamily="'Outfit', sans-serif"
                  fontSize="15px"
                  color="#1c1a16"
                  px="4"
                  _placeholder={{ color: "#b5b0a6" }}
                  _focus={{
                    borderColor: passwordMismatch ? "#e05c5c" : "#c9a84c",
                    boxShadow: passwordMismatch
                      ? "0 0 0 3px rgba(224,92,92,0.14)"
                      : "0 0 0 3px rgba(201,168,76,0.14)",
                    outline: "none",
                  }}
                  _hover={{
                    borderColor: passwordMismatch ? "#e05c5c" : "#c9a84c",
                  }}
                />
                {passwordMismatch && (
                  <Text fontSize="12px" color="#e05c5c" mt="1" fontFamily="'Outfit', sans-serif">
                    Passwords don't match
                  </Text>
                )}
                {passwordMatch && (
                  <Text fontSize="12px" color="#4caf50" mt="1" fontFamily="'Outfit', sans-serif">
                    Passwords match
                  </Text>
                )}
              </Field.Root>
            </Stack>

            {/* CTA */}
            <Button
              width="full"
              mt="6"
              h="50px"
              bg="#1c1a16"
              color="#f2ede4"
              borderRadius="10px"
              fontFamily="'Outfit', sans-serif"
              fontSize="15px"
              fontWeight="500"
              letterSpacing="0.03em"
              border="none"
              onClick={handleSignup}
              loading={loading}
              loadingText="Creating account…"
              position="relative"
              overflow="hidden"
              _hover={{ bg: "#2e2b23", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              _after={{
                content: '""',
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(201,168,76,0.15), transparent 55%)",
                pointerEvents: "none",
              }}
            >
              Create free account
            </Button>

            {/* Login link */}
            <Text
              mt="6"
              textAlign="center"
              fontSize="13px"
              color="#8a867e"
              fontFamily="'Outfit', sans-serif"
            >
              Already have an account?{" "}
              <Link
                href="/"
                color="#1c1a16"
                fontWeight="500"
                borderBottom="1px solid #c9a84c"
                pb="1px"
                textDecoration="none"
                _hover={{ color: "#c9a84c" }}
              >
                Sign in
              </Link>
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}
