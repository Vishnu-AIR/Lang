import pandas as pd
import random

columns = [
    "Post_ID", "Post_Type", "Likes", "Shares", "Comments", "Impressions", "Reach", "Date"
]
post_types = ["carousel", "reels", "staticImages", "videos"]

data = []
for i in range(1, 101):
    post_type = random.choice(post_types)
    likes = random.randint(50, 5000)
    shares = random.randint(10, 1000)
    comments = random.randint(5, 500)
    impressions = random.randint(500, 20000)
    reach = random.randint(400, 15000)
    date = pd.Timestamp('2023-12-01') + pd.to_timedelta(random.randint(0, 30), unit='d')

    data.append([i, post_type, likes, shares, comments, impressions, reach, date])

df = pd.DataFrame(data, columns=columns)

averages_by_post_type = df.groupby("Post_Type").mean(numeric_only=True).reset_index()

averages_by_post_type.rename(columns={
    "Likes": "Average_Likes",
    "Shares": "Average_Shares",
    "Comments": "Average_Comments",
    "Impressions": "Average_Impressions",
    "Reach": "Average_Reach"
}, inplace=True)

file_name = "basic_social_media_data.csv"
df.to_csv(file_name, index=False)

averages_file_name = "averages_by_post_type.csv"
averages_by_post_type.to_csv(averages_file_name, index=False)

print(f"Main file saved as {file_name}")
print(f"Averages file saved as {averages_file_name}")
