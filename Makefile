.PHONY: prod prod_build dev prod_tag prod_push prod_release
PROJ_ID=stoked-archway-645

prod_build:
	docker build -t junit_history -f Dockerfile.production .
dev:
	docker-compose up

prod_tag:
	docker tag junit_history us.gcr.io/${PROJ_ID}/junit_history

prod_push:
	gcloud docker push us.gcr.io/${PROJ_ID}/junit_history


prod: prod_build prod_tag prod_push

# Speed up gcloud
# gcloud config set disable_usage_reporting True
#
# gcloud container clusters create my-awesome-cluster --zone us-central1-a --scopes https://www.googleapis.com/auth/devstorage.read_only
# gcloud container clusters get-credentials my-awesome-cluster --zone us-central1-a
#
# gcloud compute disks create  --project "stoked-archway-645"  --zone "us-central1-a"  --size 200GB  junit-history-mongo-disk
# gcloud container clusters get-credentials my-awesome-cluster --zone us-central1-a
# kubectl create -f db-controller.yml
# kubectl create -f db-service.yml
# kubectl create -f app-controller.yml
