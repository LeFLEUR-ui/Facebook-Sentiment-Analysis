import os
import re
import numpy as np
import tensorflow as tf
from googletrans import Translator
from tensorflow.keras.datasets import imdb
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Embedding, LSTM, Dense

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')

VOCAB_SIZE = 10000
MAX_LEN = 100
EMBED_DIM = 32
MODEL_PATH = "app/ml/sentiment_lstm.h5"

translator = Translator()

if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
else:
    (x_train, y_train), (x_test, y_test) = imdb.load_data(num_words=VOCAB_SIZE)
    x_train = pad_sequences(x_train, maxlen=MAX_LEN)
    model = Sequential([
        Embedding(VOCAB_SIZE, EMBED_DIM, input_length=MAX_LEN),
        LSTM(64),
        Dense(1, activation='sigmoid')
    ])
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    model.fit(x_train, y_train, epochs=3, batch_size=64, verbose=1)
    model.save(MODEL_PATH)

raw_word_index = imdb.get_word_index()
word_index = {k: (v + 3) for k, v in raw_word_index.items()}
word_index["<PAD>"], word_index["<START>"], word_index["<UNK>"] = 0, 1, 2

def encode_comment(comment: str):
    comment = re.sub(r'[^\w\s]', '', comment.lower())
    tokens = comment.split()
    encoded = [1]
    for word in tokens:
        idx = word_index.get(word, 2)
        encoded.append(idx if idx < VOCAB_SIZE else 2)
    return pad_sequences([encoded], maxlen=MAX_LEN)

def analyze_sentiment(filipino_text: str):
    try:
        translation = translator.translate(filipino_text, src='tl', dest='en')
        english_text = translation.text
    except Exception as e:
        return {"error": f"Google Translate Error: {e}"}

    encoded = encode_comment(english_text)
    score = model.predict(encoded, verbose=0)[0][0]

    sentiment = "Positive" if score >= 0.55 else "Negative" if score <= 0.45 else "Neutral"
    score = round(model.predict(encoded, verbose=0)[0][0], 2)
    negativity = round((1 - score) * 100, 2)

    return {
        "tl": filipino_text,
        "en": english_text,
        "sentiment": sentiment,
        "negativity": negativity
    }

if __name__ == "__main__":
    print("--- Filipino Sentiment Analyzer (Google Powered) ---")
    while True:
        txt = input("\nTagalog: ")
        if txt.lower() == 'quit':
            break
        res = analyze_sentiment(txt)
        if "error" in res:
            print(f"Error: {res['error']}")
        else:
            print(f"English: {res['en']}")
            print(f"Result: {res['sentiment']} ({res['negativity']}% Negative)")