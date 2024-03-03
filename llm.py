from gpt4all import GPT4All
model = GPT4All("mistral-7b-openorca.gguf2.Q4_0.gguf")
with model.chat_session():
    response1 = model.generate(prompt='hello', temp=0)
    response2 = model.generate(prompt='write me ', temp=0)
    response3 = model.generate(prompt='thank you', temp=0)
    print(model.current_chat_session)