import styled, { keyframes, createGlobalStyle } from "styled-components";

const theme = {
  primary: '#4A90E2',
  secondary: '#5C6BC0',
  error: '#FF5252',
  success: '#4CAF50',
  text: {
    primary: '#2C3E50',
    secondary: '#546E7A',
    light: '#90A4AE'
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap');

  body {
    margin: 0;
    overflow: hidden;
    font-family: ${theme.fonts.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    letter-spacing: -0.01em;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  z-index: -1;
  filter: brightness(0.6);
`;

export const Box = styled.div`
  background: rgba(255, 255, 255, 0.98);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: min(90%, 400px);
  margin: auto;
  z-index: 1;
  animation: ${slideUp} 0.4s ease-out;
  position: relative;
  overflow: hidden;
  font-family: ${theme.fonts.primary};
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
  
  h2 {
    color: ${theme.text.primary};
    font-family: ${theme.fonts.heading};
    font-size: 2rem;
    margin-bottom: 1.8rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, ${theme.primary}, ${theme.secondary});
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
  width: 100%;
  opacity: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.text.secondary};
    font-size: 16px;
    transition: color 0.2s;
  }

  &:focus-within svg {
    color: ${theme.primary};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 42px;
  border: 1px solid ${props => props.error ? theme.error : '#E0E0E0'};
  border-radius: 12px;
  font-size: 15px;
  font-family: ${theme.fonts.primary};
  font-weight: 450;
  transition: all 0.2s;
  background: #FAFAFA;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    background: white;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
  }

  &::placeholder {
    color: ${theme.text.light};
    font-weight: 400;
  }
`;

export const ShowPasswordButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.text.secondary};
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: ${theme.primary};
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: ${props => props.disabled ? '#BDBDBD' : `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 15px;
  font-family: ${theme.fonts.primary};
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  svg.spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

export const SocialButton = styled(Button)`
  background: ${props => props.google ? '#DB4437' : props.github ? '#24292E' : `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`};
  margin-top: 10px;
  font-size: 14px;

  &:hover:not(:disabled) {
    background: ${props => props.google ? '#C53929' : props.github ? '#1B1F23' : `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`};
  }
`;

export const ErrorMessage = styled.p`
  color: ${theme.error};
  font-size: 14px;
  font-family: ${theme.fonts.primary};
  font-weight: 500;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  opacity: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
  animation-delay: 0.2s;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #E0E0E0;
  }
  
  span {
    padding: 0 12px;
    color: ${theme.text.secondary};
    font-size: 14px;
    font-family: ${theme.fonts.primary};
    font-weight: 450;
  }
`;

export const StyledLink = styled.p`
  color: ${theme.primary};
  text-decoration: none;
  font-family: ${theme.fonts.primary};
  font-weight: 600;
  transition: all 0.2s;
  display: inline-block;
  margin-top: 24px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: ${theme.secondary};
    transform: translateY(-1px);
  }
`;

export const RememberMeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  font-size: 14px;
  font-family: ${theme.fonts.primary};
  font-weight: 450;
  opacity: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
  animation-delay: 0.1s;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

export const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
  accent-color: ${theme.primary};
`;

export const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: ${theme.primary};
  cursor: pointer;
  font-size: 14px;
  font-family: ${theme.fonts.primary};
  font-weight: 500;
  padding: 0;
  transition: all 0.2s;

  &:hover {
    color: ${theme.secondary};
    transform: translateY(-1px);
  }
`;

export const PasswordRequirements = styled.div`
  text-align: left;
  margin: 12px 0;
  padding: 12px;
  background: #F5F7FA;
  border-radius: 12px;
  font-size: 13px;
  font-family: ${theme.fonts.primary};
  opacity: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
  animation-delay: 0.2s;

  p {
    color: ${theme.text.secondary};
    margin: 6px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.5;
    font-weight: 450;

    svg {
      font-size: 1em;
    }

    &.valid {
      color: ${theme.success};
      svg {
        color: ${theme.success};
      }
    }

    &.invalid {
      color: ${theme.error};
      svg {
        color: ${theme.error};
      }
    }
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  margin: 12px 0;
  overflow: hidden;
  opacity: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
  animation-delay: 0.1s;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(to right, ${theme.primary}, ${theme.secondary});
    transition: width 0.3s ease;
  }
`;

export const StrengthIndicator = styled.div`
  font-size: 13px;
  font-family: ${theme.fonts.primary};
  color: ${props => {
    if (props.strength >= 80) return theme.success;
    if (props.strength >= 60) return '#66BB6A';
    if (props.strength >= 40) return '#FFA726';
    if (props.strength >= 20) return '#FF7043';
    return theme.error;
  }};
  margin-top: 6px;
  font-weight: 500;
  opacity: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
  animation-delay: 0.1s;
`;
