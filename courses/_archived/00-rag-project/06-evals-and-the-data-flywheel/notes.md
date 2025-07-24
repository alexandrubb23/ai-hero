- Data Quality, Coverage and Quantity
- Making datasets easy to author
- TRY Exact Match
- TRY Lexical Similarity
- TRY Semantic Similarity
- TRY: Documenting annotation guidelines
- TRY: Integrating evals into the CI
- TODO: more here

---

Every AI product sucks to start with because you haven't put enough data through the system in order to make it better. The fact that these products suck can actually impact whether managers and companies decide to put it out there. Figma AI is a great example.

---

When you're thinking about data curation, you need to address questions like:

- What data do you need?
- How much of it do you need?
- What does high quality or low quality data mean for you?

And then you need to think about techniques for data synthesis and processing. Curation, generation, and processing don't follow a linear path.

---

Data will mostly be blood, sweat, and tears. Working with data is really hard.

---

The right data can make a model more capable and safer. Poor data can cause the model to increase its biases and hallucinations. Mistakes in data can harm the model and waste resources.

---

At a high level, data creation follows three criteria: data quality, data coverage, and data quantity.

Data quality is like the quality of the ingredients in a meal: you can't have good food if your ingredients are spoiled. Data coverage is equivalent to having the right mix of ingredients, i.e., shouldn't have too much or too little sugar, and data quantity is about how many of these ingredients you should have.

---

Data coverage means the model's data should cover the range of problems you expect it to solve. Real-world users will have a wide range of problems, and the way they express those problems can be very different.

In the Llama 3 paper, meta researchers basically said that all of their gains were due to improving data quality and data coverage, not necessarily gains in their model architecture.
