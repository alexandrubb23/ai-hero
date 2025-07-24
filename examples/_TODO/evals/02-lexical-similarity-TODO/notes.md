Uses a lexical similarity algorithm like BLEU, ROUGE, METEOR++, TER and CIDEr.

Requires curating a comprehensive set of reference responses. A good response can get a low similarity score if the reference set doesn't contain any response that looks like it. For example, if the LLM says "that's Big Ben" but the reference set only contains "that's a clock tower", the lexical similarity score will be low.
