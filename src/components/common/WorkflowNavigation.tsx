import React from "react";
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkflowStore } from "@store/workflowStore";
import BubbleButton from "@components/common/BubbleButton";
import "./WorkflowNavigation.scss";

interface WorkflowNavigationProps {
  currentStepId: string;
  onStepComplete?: () => void;
  autoProgress?: boolean;
  showProgress?: boolean;
}

const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentStepId,
  onStepComplete,
  autoProgress = true,
  showProgress = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    steps,
    currentStep,
    completedSteps,
    completeStep,
    getNextStep,
    getPreviousStep,
    canAccessStep,
    setCurrentStep,
  } = useWorkflowStore();

  const currentStepData = steps.find((step) => step.id === currentStepId);
  const nextStep = getNextStep();
  const previousStep = getPreviousStep();

  const handleNext = () => {
    if (currentStepData && !completedSteps.includes(currentStepData.id)) {
      completeStep(currentStepData.id);
      onStepComplete?.();
    }

    if (nextStep && canAccessStep(nextStep.id)) {
      setCurrentStep(nextStep.order);
      navigate(nextStep.path);
    }
  };

  const handlePrevious = () => {
    if (previousStep) {
      setCurrentStep(previousStep.order);
      navigate(previousStep.path);
    }
  };

  const handleStepClick = (step: any) => {
    if (canAccessStep(step.id)) {
      setCurrentStep(step.order);
      navigate(step.path);
    }
  };

  const getStepProgress = () => {
    return (completedSteps.length / steps.length) * 100;
  };

  const getStepIcon = (step: any) => {
    const icons = {
      index: "🏠",
      countdown: "⏰",
      anniversary: "💕",
      "love-story": "💌",
      gallery: "📸",
      games: "🎮",
      fireworks: "🎆",
    };
    return icons[step.id as keyof typeof icons] || "💖";
  };

  const getStepStatus = (step: any) => {
    if (completedSteps.includes(step.id)) return "completed";
    if (step.id === currentStepId) return "current";
    if (step.unlocked) return "unlocked";
    return "locked";
  };

  return (
    <div className="workflow-navigation">
      {/* Progress indicator */}
      {showProgress && (
        <div className="workflow-progress">
          <Container>
            <Row>
              <Col>
                <div className="progress-header">
                  <h5>Journey Progress</h5>
                  <span className="progress-text">
                    {completedSteps.length} of {steps.length} completed
                  </span>
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${getStepProgress()}%` }}
                  />
                </div>

                {/* Step indicators */}
                <div className="steps-indicator">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className={`step-indicator ${getStepStatus(step)}`}
                      onClick={() => handleStepClick(step)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="step-icon">{getStepIcon(step)}</div>
                      <div className="step-name">{step.name}</div>
                      {completedSteps.includes(step.id) && (
                        <div className="step-check">✅</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Navigation controls */}
      <div className="workflow-controls">
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              {previousStep && (
                <BubbleButton
                  variant="outline"
                  size="md"
                  onClick={handlePrevious}
                  bubbleEffect={true}
                  glowEffect={false}
                >
                  ← {previousStep.name}
                </BubbleButton>
              )}
            </Col>

            <Col xs="auto" className="text-center">
              {currentStepData && (
                <motion.div
                  className="current-step-info"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="step-icon-large">
                    {getStepIcon(currentStepData)}
                  </div>
                  <h4>{currentStepData.name}</h4>
                  <p>
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </motion.div>
              )}
            </Col>

            <Col xs="auto">
              {nextStep && (
                <BubbleButton
                  variant="romantic"
                  size="md"
                  onClick={handleNext}
                  bubbleEffect={true}
                  glowEffect={true}
                  heartBurst={true}
                >
                  {nextStep.name} →
                </BubbleButton>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Auto-progress notification */}
      {autoProgress && nextStep && (
        <motion.div
          className="auto-progress-hint"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 2 }}
        >
          <Container>
            <Row>
              <Col className="text-center">
                <p>
                  💡 Complete this section to unlock:{" "}
                  <strong>{nextStep.name}</strong>
                </p>
              </Col>
            </Row>
          </Container>
        </motion.div>
      )}
    </div>
  );
};

export default WorkflowNavigation;
