class AiService {
  async askAssistant(prompt, userContext) {
    if (!prompt) {
      const error = new Error('Please provide a prompt');
      error.statusCode = 400;
      throw error;
    }

    // TODO: Integrate actual AI provider here with strict tenant boundary checks
    // using userContext (e.g., userContext.societyId, userContext.role)
    const aiResponseText = `This is a placeholder AI response to your prompt: "${prompt}". AI integration will go here. Context applied for society: ${userContext.societyId}.`;

    return aiResponseText;
  }
}

module.exports = new AiService();
