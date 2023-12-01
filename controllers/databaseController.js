const User = require('../models/user');
const OpenAI = require('openai');
const puppeteer = require('puppeteer');
require('dotenv').config();

//OpenAi
const secretAI = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: secretAI,
});

//ai functions
async function sendFitnessChatRequest(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return console.status(404).json({ message: 'User not found' });
    }

    const userSummary = `This user is ${user.health.age} years old, this height ${user.health.height}, this weight ${user.health.weight}, this user's current activity level is this ${user.health.activity}, this user's fitness skill level / knowledge level is ${user.health.skillLevel}, this user's time availability is ${user.health.timeAvailability}, this user's preffered type of exercise(s) is/are ${user.health.prefferedExercise}, this user's limitations are ${user.health.limitations}, these are additional comments made by the user about their current health and fitess ${user.health.other}. These are the users goals: overall goals ${user.goals.overall}, strength goals ${user.goals.strength}, weight goals ${user.goals.weight}, other goals ${user.goals.other}`;

    const fitnessTitlePrompt = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that is very knowledgable about health and fitness, you are a personal trainer/ health coach.',
      },
      {
        role: 'user',
        content: `Generate a title for a fitness plan for this user based upon this information about them ${userSummary}.`,
      },
    ];

    const fitnessBodyPrompt = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that is very knowledgable about health and fitness, you are basically a personal trainer/ health coach.',
      },
      {
        role: 'user',
        content: `Generate a fitness plan for this user based upon this information about them ${userSummary}. Only include information about a fitness plan, nutrition and diet will be covered elsewhere. Do not introduce your response, just get right into the content`,
      },
    ];

    const messages = [[...fitnessTitlePrompt], [...fitnessBodyPrompt]];

    const responseTitle = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages[0],
      max_tokens: 50,
    });

    const responseBody = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages[1],
      max_tokens: 1000,
    });

    user.fitnessPlan = {
      title: responseTitle.choices[0].message.content,
      body: responseBody.choices[0].message.content,
    };

    await user.save();
  } catch (err) {
    console.log(err);
  }
}

async function sendDietChatRequest(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return console.status(404).json({ message: 'User not found' });
    }

    const userSummary = `This user is ${user.health.age} years old, this height ${user.health.height}, this weight ${user.health.weight}, this user's current activity level is this ${user.health.activity}, this user's fitness skill level / knowledge level is ${user.health.skillLevel}, this user's time availability is ${user.health.timeAvailability}, this user's preffered type of exercise(s) is/are ${user.health.prefferedExercise}, this user's limitations are ${user.health.limitations}, these are additional comments made by the user about their current health and fitess ${user.health.other}. These are the users goals: overall goals ${user.goals.overall}, strength goals ${user.goals.strength}, weight goals ${user.goals.weight}, other goals ${user.goals.other}`;

    const dietTitlePrompt = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that is very knowledgable about health and fitness, you are a personal trainer/ health coach.',
      },
      {
        role: 'user',
        content: `Generate a title for a diet plan for this user based upon this information about them ${userSummary}.`,
      },
    ];

    const dietBodyPrompt = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that is very knowledgable about health and fitness, you are basically a personal trainer/ health coach.',
      },
      {
        role: 'user',
        content: `Generate a diet plan for this user based upon this information about them ${userSummary}. Only include information about a diet plan, nutrition and fitness will be covered elsewhere. Do not introduce your response, get right into the content`,
      },
    ];

    const messages = [[...dietTitlePrompt], [...dietBodyPrompt]];

    const responseTitle = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages[0],
      max_tokens: 50,
    });

    const responseBody = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages[1],
      max_tokens: 1000,
    });

    user.dietPlan = {
      title: responseTitle.choices[0].message.content,
      body: responseBody.choices[0].message.content,
    };

    await user.save();
  } catch (err) {
    console.log(err);
  }
}

async function sendNutritionChatRequest(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return console.status(404).json({ message: 'User not found' });
    }

    const userSummary = `This user is ${user.health.age} years old, this height ${user.health.height}, this weight ${user.health.weight}, this user's current activity level is this ${user.health.activity}, this user's fitness skill level / knowledge level is ${user.health.skillLevel}, this user's time availability is ${user.health.timeAvailability}, this user's preffered type of exercise(s) is/are ${user.health.prefferedExercise}, this user's limitations are ${user.health.limitations}, these are additional comments made by the user about their current health and fitess ${user.health.other}. These are the users goals: overall goals ${user.goals.overall}, strength goals ${user.goals.strength}, weight goals ${user.goals.weight}, other goals ${user.goals.other}`;

    const nutritionTitlePrompt = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that is very knowledgable about health and fitness, you are a personal trainer/ health coach.',
      },
      {
        role: 'user',
        content: `Generate a title for a Nutrition/supplementaion plan for this user based upon this information about them ${userSummary}. Nutrition means supplimentation, vitamins, etc.`,
      },
    ];

    const nutritionBodyPrompt = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that is very knowledgable about health and fitness, you are basically a personal trainer/ health coach.',
      },
      {
        role: 'user',
        content: `Generate a Supplementation plan for this user based upon this information about them ${userSummary}. Only include information about supplementation/vitamins in the plan, diet and fitness will be covered elsewhere. Nutrition means supplimentation, vitamins, etc. Do not introduce your response, get right into the content`,
      },
    ];

    const messages = [[...nutritionTitlePrompt], [...nutritionBodyPrompt]];
    console.log(messages);

    const responseTitle = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages[0],
      max_tokens: 50,
    });

    const responseBody = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages[1],
      max_tokens: 500,
    });

    user.nutritionPlan = {
      title: responseTitle.choices[0].message.content,
      body: responseBody.choices[0].message.content,
    };

    await user.save();
  } catch (err) {
    console.log(err);
  }
}

const health_post = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.health = {
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      activity: req.body.activity,
      skillLevel: req.body.skillLevel,
      timeAvailability: req.body.timeAvailability,
      prefferedExercise: req.body.prefferedExercise,
      limitations: req.body.limitations,
      other: req.body.other,
    };

    await user.save();
    res.redirect('/goals-questions');
  } catch (err) {
    console.log(err);
  }
};

const goals_post = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.goals = {
      overall: req.body.overall,
      strength: req.body.strength,
      weight: req.body.weight,
      other: req.body.other,
    };

    await user.save();
    console.log('Before sending fitness chat request');
    await sendFitnessChatRequest(id);
    console.log('After sending fitness chat request');

    console.log('Before sending diet chat request');
    await sendDietChatRequest(id);
    console.log('After sending diet chat request');

    console.log('Before sending nutrition chat request');
    await sendNutritionChatRequest(id);
    console.log('After sending nutrition chat request');
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
  }
};

//pdf functions
const generateWorkoutPDF = async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch user data from MongoDB
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the content for the PDF
    const content = `
      <h1>${user.fitnessPlan.title}</h1>
      <p>${user.fitnessPlan.body}</p>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'Letter' });

    // Close the browser
    await browser.close();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Fitness-plan.pdf'
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const generateDietPDF = async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch user data from MongoDB
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the content for the PDF
    const content = `
      <h1>${user.dietPlan.title}</h1>
      <p>${user.dietPlan.body}</p>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'Letter' });

    // Close the browser
    await browser.close();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Diet-plan.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const generateNutritionPDF = async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch user data from MongoDB
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the content for the PDF
    const content = `
      <h1>${user.nutritionPlan.title}</h1>
      <p>${user.nutritionPlan.body}</p>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'Letter' });

    // Close the browser
    await browser.close();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Nutrition-plan.pdf'
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  health_post,
  goals_post,
  sendNutritionChatRequest,
  sendDietChatRequest,
  sendFitnessChatRequest,
  generateWorkoutPDF,
  generateDietPDF,
  generateNutritionPDF,
};
